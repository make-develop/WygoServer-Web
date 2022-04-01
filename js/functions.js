// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDxVKNTgQUbAFj28KxJoz4stLMWy9MiTLc",
    authDomain: "eatitv2-16ab6.firebaseapp.com",
    databaseURL: "https://eatitv2-16ab6.firebaseio.com",
    projectId: "eatitv2-16ab6",
    storageBucket: "eatitv2-16ab6.appspot.com",
    messagingSenderId: "1014674292296",
    appId: "1:1014674292296:web:cc1b601696a482c883227d",
    measurementId: "G-5Z7DKQFS6R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();


//Registro
/*
const singupForm = document.querySelector('#singup-form');

singupForm.addEventListener('submit',(e) => {
    e.preventDefault();

    const email = document.querySelector('#singup-email').value;
    const password = document.querySelector('#singup-password').value;

    auth
        .createUserWithEmailAndPassword(email,password)
        .then(userCredential => {
            singupForm.reset();//limpiar modal

            console.log("registrado")
        })
})*/


//Logeo

const singinForm = document.querySelector('#login-form');
const contentPage = document.querySelector('#contenido-principal');

singinForm.addEventListener('submit', e =>{
    e.preventDefault();
    const email = document.querySelector('#modlgn_username').value;
    const password = document.querySelector('#modlgn_passwd').value;

    console.log(email + "  "+ password);

    auth
    .signInWithEmailAndPassword(email,password)
    .then(userCredential => {
        //  $('#signInModal').modal('hide');
        
        singinForm.reset();//limpiar modal
      contentPage.style.display = 'none';
        console.log("logueado")
    })

});

//Cerrar sesion
const salir = document.querySelector('#logOut');

salir.addEventListener('click', e =>{
    e.preventDefault();
    auth.signOut().then(() =>{
        contentPage.style.display="block";
        console.log("salir");
    });
});


//Main Content Table
const tableDocument = document.querySelector('.tableContent');


//Event show content
auth.onAuthStateChanged(user  => {
    if(user){
        console.log("Loagueado singn in");
        userTableLogin();
        salir.style.display = 'block';
    }else{
        tableDocument.style.display = 'none';
        salir.style.display = 'none';
    }
})




//DATA TABLE  PINTAR TABLA 

async function userTableLogin(){

    tableDocument.style.display = 'block';
    salir.style.display = 'block';

    var filaEliminada; //para capturara la fila eliminada
    var filaEditada; //para capturara la fila editada o actualizada

    //creamos constantes para los iconos editar y borrar
    const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

    var db = firebase.database();
    var coleccionServerPartners = db.ref().child("Server");

    var dataSet = [];//array para guardar los valores de los campos inputs del form
    var table = await $('#tablaServerPartners').DataTable({
                pageLength : 5,
                lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
                data: dataSet,
                columnDefs: [
                    {
                        targets: [0],
                        visible: false, //ocultamos la columna de ID que es la [0]
                    },
                    {
                        targets: -1,
                        defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>"+iconoEditar+"</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>"+iconoBorrar+"</button></div></div>"
                    }
                ]
            });

    coleccionServerPartners.on("child_added", datos => {
        dataSet = [datos.key, datos.child("active").val(), datos.child("name").val(), datos.child("phone").val(),datos.child("restaurant").val()];
        table.rows.add([dataSet]).draw();
    });
    coleccionServerPartners.on('child_changed', datos => {
        dataSet = [datos.key, datos.child("active").val(), datos.child("name").val(), datos.child("phone").val(),datos.child("restaurant").val()];
        table.row(filaEditada).data(dataSet).draw();
    });
    coleccionServerPartners.on("child_removed", function() {
        table.row(filaEliminada.parents('tr')).remove().draw();
    });

    $('form').submit(function(e){
        e.preventDefault();
        let uid = Boolean($.trim($('#uid').val()));
        let active = $.trim($('#active').val());
        let name = $.trim($('#name').val());
        let phone = $.trim($('#phone').val()); 
        let restaurant = $.trim($('#restaurant').val());    
        let idFirebase = uid;
        if (idFirebase == ''){
            idFirebase = coleccionServerPartners.push().key;
        }; 
        data = {active:active, name:name, phone:phone, restaurant:restaurant};
        actualizacionData = {};
        actualizacionData[`/${idFirebase}`] = data;
        coleccionServerPartners.update(actualizacionData);
        uid = '';
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('hide');
    });

    //Botones
    $('#btnNuevo').click(function() {
        $('#uid').val('');
        $('#active').val('');
        $('#name').val('');
        $('#phone').val('');  
        $('#restaurant').val('');
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('show');
    });

    await $("#tablaServerPartners").on("click", ".btnEditar", function() {
        filaEditada = table.row($(this).parents('tr'));
        let fila = $('#tablaServerPartners').dataTable().fnGetData($(this).closest('tr'));
        let uid = fila[0];
        console.log(uid);
		let active = Boolean($(this).closest('tr').find('td:eq(0)').text()); 
        let name = $(this).closest('tr').find('td:eq(1)').text();        
        let phone = parseInt($(this).closest('tr').find('td:eq(2)').text()); 
        let restaurant = $(this).closest('tr').find('td:eq(3)').text();
        $('#uid').val(uid);
        $('#active').val(active);
        $('#name').val(name);
        $('#phone').val(phone);
        $('#restaurant').val(restaurant);
        $('#modalAltaEdicion').modal('show');
	});
  
    $("#tablaServerPartners").on("click", ".btnBorrar", function() {   
        filaEliminada = $(this);
        Swal.fire({
        title: '¿Está seguro de eliminar el producto?',
        text: "¡Está operación no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar'
        }).then((result) => {
        if (result.value) {
            let fila = $('#tablaServerPartners').dataTable().fnGetData($(this).closest('tr'));
            let uid = fila[0];            
            db.ref(`productos/${uid}`).remove()
            Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.','success')
        }
        })
	});
}