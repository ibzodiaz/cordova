document.addEventListener("deviceready", onDeviceReady, true);

function onDeviceReady(){

	showContacts();

	$("#showEdit").on('click',function(){

    
    	if($(this).text() == 'Modifier'){

    		$(".formulaire").show();
    		$(this).html('cacher');

    	}else{

    		$(".formulaire").hide();
    		$(this).html('Modifier');

    	}
    });

	$("#AjouterContact").on('click',function(){

		let nomcomplet = $("#NomComplet").val();
		let telephone =  $("#telephone").val();
		let email =  $("#email").val();
		let adresse =  $("#adresse").val();
		
		myContact = navigator.contacts.create({

		    displayName:nomcomplet,
		    phoneNumbers: [{
		        "type": "mobile",
		        "value": telephone
		    }
		    ],
		    emails:[
				{"type":"home","value":email}
			],
		    addresses:[{
				"postalCode":null,
				"type":"work",
				"locality":null,
				"streetAddress":" ",
				"region":" ",
				"country":adresse
			}]

		}); 
		myContact.save(addSuccess,getErrorContact); 
		
	});
	
}


function showContacts() {
	var options      = new ContactFindOptions();

	options.filter   = "";

	options.multiple = true;

    var fields = ["*"];

    navigator.contacts.find(fields, onSuccessContact, getErrorContact, options);
}

function onSuccessContact(contacts) {
    let contactsHtml = '';

    for (let i = 0 ; i < contacts.length ; i++) {

        contactsHtml += `
            <li>
	            <a href="#showContactInfos" onclick="getContact(${contacts[i].id});">
	                <img src="img/icon.webp" alt="Image du contact">
	                <h2>${contacts[i].displayName}</h2>
	                <p>${contacts[i].phoneNumbers[0].value}</p>
	            </a>
	        </li>
        `;
        
    }
    ListeContact.innerHTML = contactsHtml;
    $("#ListeContact").listview('refresh');
   
    

}

function getContact(id) {
	
	let fields = ['id'];
    let options = new ContactFindOptions();
    options.filter = id;
    options.multiple = false;
	navigator.contacts.find(fields,ContactSuccess,getErrorContact,options);
}


function ContactSuccess(contacts){

    let contactShow = $("#contactShow");

    contactShow.html('');

    let contact =contacts[0];

    $("#newNomComplet").attr('value',contact.displayName);
	
	$("#newTelephone").attr('value',contact.phoneNumbers[0].value);

    let contactInfos =  `
    		<li>
       
               
                <img src="img/icon.webp" width="50" height="50" alt="Image du contact">
           
	            
	        </li>
            <li>
       
                
                <h1><u>NOM</u>: ${contact.displayName}</h1>
           
	            
	        </li>
	        <li>
                <h1><u>NUMERO</u>: ${contact.phoneNumbers[0].value}</h1>
            </li>
          	`;

    if(contact.emails == null){

    	contactInfos += '<li><h1><u>EMAIL</u>: Non renseigné</h1></li>';

    	$("#newEmail").attr('value',null);

    }else{

    	contactInfos += `<li><h1><u>EMAIL</u>: ${contact.emails[0].value == 'undefined' ? "Non renseigné" : contact.emails[0].value }</h1></li>`;

    	$("#newEmail").attr('value',contact.emails[0].value);
    } 

    if(contact.addresses == null){

    	contactInfos += '<li><h1><u>ADRESSE</u>: Non renseigné</h1></li>';

    	$("#newAdresse").attr('value',null);

    }else{

    	contactInfos += `<li><h1><u>ADRESSE</u>: ${contact.addresses[0].formatted}</h1></li>`;

    	$("#newAdresse").attr('value',contact.addresses[0].formatted);

    }     

    contactShow.html(contactInfos) ; 


    

    $("#edit").on('click',function (){

    	if(contact != null){
    		contact.displayName = $("#newNomComplet").val();
			contact.phoneNumbers[0].value = $("#newTelephone").val();
			contact.emails[0].value = $("#newEmail").val();
			contact.addresses[0].formatted = $("#newAdresse").val();

			contact.save(editSuccess,getErrorContact);
    	}
    	
    });
		
 

    $("#delete").on('click',function(){
    	let opts = "Voulez-vous supprimer ce contact ?";
    	let resp = confirm(opts);
    	if(resp){
    		contact.remove(removeSuccess,getErrorContact);
    	}
    	
    });     

}

function editSuccess(){
	alert("Modification effectuée !");
	location.reload();
}


function removeSuccess(){
	alert("Suppression effectuée !");
	window.location.href = "#showContactPage";
	location.reload();
}


function addSuccess(){
	alert("Nouveau contact !");
	location.reload();
}

function getErrorContact(error){
	alert("Error = " + error.code);
}



