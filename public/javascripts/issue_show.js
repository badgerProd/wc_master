/* Javascript for Issue Show page */
$(function() {

// -------------------------------------------------------------------------------
// STUFF TO BE DONE ON THE INITIAL LOAD OF THE PAGE
// -------------------------------------------------------------------------------
	
	// if the relationship_type is known then add class to the corresponding relationship_partial_toggle
	if (this_relationship_type){
		$(".relationship_partial_toggle:contains(" + this_relationship_type + ")").filter(function(){
		  $(this).addClass("central_causality_container")
		});		
	}

	// Form sentence 
	if (!$("#title_dynamic_text").text().trim().length) {
	    $("#title_filler_text").show();}

	// Make the correct thumbnail opque
	if ($("#title_relationship").text().trim().length) {
		var opaqueDiv = $(".relationship_thumb_title").filter(function() {
			return $(this).text().trim() == $("#title_relationship").text().trim();
         });
         // make the rest of the Divs transparent
        $('.relationship_thumb').not(opaqueDiv.parents('.relationship_thumb')).animate({'opacity': '0.3'}); 
        // Hide ellipsis
        $("#title_relationship_ellipsis").hide();         	
	}

// -------------------------------------------------------------------------------
// FUNCTION TO GO BACK TO DEFAULT STATE OF SHOW PAGE (ISSUE SPECIFIC INFO)
// -------------------------------------------------------------------------------
	$(".issue_thumb_container").live('click', function(){
		
		// Set up the values of hidden fields for get_relationship form
		$("#get_rel_issueid_input").val($("#issue_id_store").text().trim());
		$("#get_rel_sentence_input").val("");
		$("#get_relationship_input").val("");
		$("#select_rel_type").val("");
		
		// Revert styles (if any) to default 
		$('.relationship_thumb').removeAttr('style');
		$(".relationship_thumb_suggestion").removeAttr('style').removeClass('suggestion_selected');	
		$(".relationship_thumb .issue_linkout").removeAttr('style');
		
		// Show progress message
		show_progress_message('loading')
		
		// Submit the form
		$.get($("#select_rel_form").attr("action"), $("#select_rel_form").serialize(), null, "script");
		//$.get($("#get_relationship_form").attr("action"), $("#get_relationship_form").serialize(), null, "script");
		
	})
	
	
// -------------------------------------------------------------------------------
// FUNCTION TO CYCLE THROUGH THE VARIOUS RELATIONSHIP TYPES BASED ON USER CLLICK 
// -------------------------------------------------------------------------------
$(".relationship_partial_toggle:not(.central_causality_container)").live('click',function(){
	
	// Show message
	show_progress_message("loading relationships");
	
	// Submit the form
    $("#select_rel_type").val($(this).text().trim());
    $("#select_rel_submit").trigger('click');

});	

// -------------------------------------------------------------------------------
// SENTENCE FORMATION ON HOVERING UPON RELATIONSHIP_TYPES
// -------------------------------------------------------------------------------

$(".relationship_partial_toggle:not(.central_causality_container)").live('mouseover', function(){
	
	// Hide Stuff:
	$("#title_relationship, #title_causality").hide();
	
	// Show causality
    $("#title_causality_hover").html($(this).text().trim())	
	$("#title_causality_hover, #title_relationship_ellipsis").show();
});	

$(".relationship_partial_toggle:not(.central_causality_container)").live('mouseout', function(){
	
	// show Stuff:
	$("#title_relationship, #title_causality").show();
	
	// hide causality
    $("#title_causality_hover").html('');
    $("#title_causality_hover").hide();
	
	// hide ellipsis if relationship span has some text
	if ($("#title_relationship").text().trim() != "" ){
		$("#title_relationship_ellipsis").hide();	
	}    
});	

// -------------------------------------------------------------------------------
// SENTENCE FORMATION ON HOVERING UPON RELATIONSHIP THUMBNAILS
// -------------------------------------------------------------------------------

$(".relationship_thumb:not(.selected_relationship_thumb, .selected_suggestion_thumb)").live('mouseover', function(){
	
	// Remove other classes 
	$("#title_causality").removeClass('suggested_causality')
	// Hide Stuff:
	$("#title_relationship, #title_relationship_ellipsis").hide();
	
	// Show causality
	$("#title_causality").html($(".central_causality_container").text().trim());
    $("#title_relationship_hover").html($(this).children(".relationship_thumb_title").text().trim());	
	$("#title_relationship_hover").show();
});	

$(".relationship_thumb:not(.selected_relationship_thumb, .selected_suggestion_thumb)").live('mouseout', function(){
	
	// Show stuff
	$("#title_relationship").show();
	
	// Show ellipsis only if nothing's there in relationship span
	if ($("#title_relationship").text().trim() == "" ){
		$("#title_relationship_ellipsis").show();	
	}
	
	// Hide stuff
    $("#title_relationship_hover").html('');	
	$("#title_relationship_hover").hide();
	
	// If some suggestion was selected then
	if ($(".selected_suggestion_thumb")[0]){
   		$("#title_causality").html(suggestion_hover_sentence()).addClass('suggested_causality');
	}
	
});	

// -------------------------------------------------------------------------------
// SENTENCE FORMATION ON HOVERING UPON SUGGESTION THUMBNAILS
// -------------------------------------------------------------------------------

$(".suggestion_thumb:not(.selected_suggestion_thumb)").live('mouseover', function(){
	
	// Hide Stuff:
	$("#title_relationship, #title_relationship_ellipsis, #title_causality").hide();
	
	// Show causality
    $("#title_relationship_hover").html($(this).children(".relationship_suggestion_title").text().trim());	
	$("#title_causality_hover").html(suggestion_hover_sentence());
	$("#title_relationship_hover, #title_causality_hover").show();
});	

$(".suggestion_thumb:not(.selected_suggestion_thumb)").live('mouseout', function(){
	
	// Show stuff
	$("#title_relationship, #title_causality").show();

	// Show ellipsis only if nothing's there in relationship span
	if ($("#title_relationship").text().trim() == "" ){
		$("#title_relationship_ellipsis").show();	
	}

	// Hide stuff
    $("#title_relationship_hover, #title_causality_hover").html('');	
	$("#title_relationship_hover, #title_causality_hover").hide();
});	

// -------------------------------------------------------------------------------
// CREATING SUGGESTION CAUSAL SENTENCE BASED ON CURRENT RELATIONSHIP TYPE
// -------------------------------------------------------------------------------

  function suggestion_hover_sentence(){
  	
  	var current_sentence = $(".central_causality_container").text().trim();
	var suggestion_sentence = ""
	
	switch (current_sentence) { 
	  case 'is caused by':
		suggestion_sentence = 'may be caused by';
	  break;
	  case 'causes':
		suggestion_sentence = 'may cause';
	  break;
	  case 'is reduced by':
		suggestion_sentence = 'may be reduced by';
	  break;
	  case 'reduces':
		suggestion_sentence = 'may reduce';
	  break;
	  case 'is a superset of':
		suggestion_sentence = 'may be a superset of';
	  break;
	  case 'is a subset of':
		suggestion_sentence = 'may be a subset of';
	  break;
	  }
	
	return suggestion_sentence;
  	 
  }

// -------------------------------------------------------------------------------
// FUNCTIONS TO PAGINATE CAUSES/EFFECTS/INHIBITORS/INHIBITEDS/SUBSETS/SUPERSETS
// -------------------------------------------------------------------------------	

  $("#relation_pagination .pagination a").live("click", function() {
	show_progress_message("loading")
	$.getScript(this.href);	
	return false;
  });

// -------------------------------------------------------------------------------
// FUNCTIONS TO GET DATA FOR SELECTED RELATIONSHIP
// -------------------------------------------------------------------------------	

$(".relationship_thumb_title a, .relationship_thumb_main a").live('click',function(){
	
	// Make this thumbnail opaque and add a white border
	var parent_thumb = $(this).parents('.relationship_thumb')
	//parent_thumb.children(".relationship_thumb_main").addClass("relationship_thumb_selected");
	parent_thumb.animate({'opacity': '1'});
	
	// reduce opacity of the rest of the thumbnails
	$('.relationship_thumb').not($(this).parents('.relationship_thumb')).animate({'opacity': '0.3'});
	
	// Remove any existing stle attributes/backgrounds from the thumbnails
	$(".relationship_thumb_suggestion").removeAttr('style').removeClass('suggestion_selected');	
	$(".relationship_thumb").removeClass('selected_relationship_thumb');
	$(".suggestion_thumb").removeClass('selected_suggestion_thumb');
	parent_thumb.addClass('selected_relationship_thumb');
				
	// show message
	show_progress_message("loading relationship data");
	
	var relationship_id = $(this).parents('.relationship_thumb').children('.relationship_id_store').html().trim();
	
	$("#title_filler_text").hide();
	
	close_addNew();
	$('.del-relation').attr('href', "../relationships/" + relationship_id);
	
	$(".relationship_thumb .issue_linkout").removeAttr('style');
	$(this).parents('.relationship_thumb').children(".issue_linkout").fadeIn();


	//return false;
});

                                                                                     
	$(".relationship_addnew .poplight").live('click',function(){
		initialize_addNew();
		$("#modal_form").toggle();		
	});
	
	$('.btn_close, .relationship_partial_toggle, .suggestion_thumb').live('click', function(){
		close_addNew();
		$("#modal_form").hide();
	});


// -------------------------------------------------------------------------------
// RELATIONSHIP DELETE FUNCTIONS
// -------------------------------------------------------------------------------
  // UNCOMMENT THE FOLLOWING CODE FOR CUSTOM CONFIRM TO SHOW!
//  window.confirm = false;
//  var href_carrier = '';
//  var bubble_to_remove = '';
        
  //$(".del-relation").live('click', function(e) {
  //	e.preventDefault();
  //	var title = $(this).data('title');
  //	var msg = "Are you sure you want to remove this causal link?"
  //	href_carrier = $(this).attr('href');
  //	bubble_to_remove = $(this).parents(".bubble");
  //	showPopup(title, msg);
  
  //return false;      
  
  //});


// -------------------------------------------------------------------------------
// FUNCTION TO DELETE RELATIONSHIP IF YES WAS CLICKED
// -------------------------------------------------------------------------------	
  $("#confirm_yes").live('click', function() {
  	// Show the spinner
  	$("#confirm_wait").html('<img border="0" src="/images/system/spinnerf6.gif"/>');
  	
  	// Make Ajax Call
  	$.ajax({
  		type: "DELETE",
  		url: href_carrier,
	    cache: false,
	    // If Ajax call is succesful
	    success: function(){
		    // Reload partial
		    $("#select_rel_submit").trigger('click');
		    // Do stuff
		    $("#confirm_msg").html('Causal Link Deleted!'); 
		    $("#confirm_buttons").hide(); 
		    $("#confirm_wait").empty();
		    // Remove the modal
		    $("#confirm_popup").delay(2000).fadeOut('slow', function(){
			    $('#fade').delay(2000).remove();
	    		$("#get_relationship .title,#get_relationship .rationale_container").empty();
	  		});
  		   }
  		});  
  });

// -------------------------------------------------------------------------------
// FUNCTION TO REMOVE MODAL IF USER CANCELED DELETION
// -------------------------------------------------------------------------------	
  $("#confirm_cancel").click(function() {
	  $('#fade').remove();
  	  $("#confirm_popup").fadeOut('slow');    
  	  href_carrier = '';
  });

// -------------------------------------------------------------------------------
// SHOW SPINNER ON REFERENCE FORM and COMMENTS FORM SUBMISSION
// -------------------------------------------------------------------------------	
  $('#reference_collector').live('click', function(e){
  	if ($("#ref_content_field").val().length == 0)
  		{e.preventDefault();}
  	else
  		{ $("#references_wait").html('<img border="0" src="/images/system/spinnerf6.gif" width="22px"/>');}
  });	

  $('#comment_collector').live('click', function(e){
	if ($("#com_content_field").val().length == 0)
  		{e.preventDefault();}
  	else
  		{$("#comments_wait").html('<img border="0" src="/images/system/spinnerf6.gif" width="22px"/>');}
  });


// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// A D D    N E W    R E L A T I O N S H I P     F U N C T I O N S 
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||	

// -------------------------------------------------------------------------------
// A R R O W    K E Y    N A V I G A T I O N    F O R    T H E    M O D A L
// -------------------------------------------------------------------------------  
  window.displayBoxIndex = -1;
  
  // Arrow keys pressed while being within the Query Box
  $("#query").keyup(function(e) 
  	{
	  if (e.keyCode == 40){  
	  	Navigate(1);}
	  if(e.keyCode==38){
	  	Navigate(-1);}
	  if (e.keyCode == 13){
		  $("#query").val($(".suggestion").eq(displayBoxIndex).html());
		  $("#results").empty();
		  displayBoxIndex = -1;
  	}
  });
                   
  var Navigate = function(diff) {
  	displayBoxIndex += diff;
  	var oBoxCollection = $(".suggestion");
  	if (displayBoxIndex >= oBoxCollection.length)
  		displayBoxIndex = 0;
  	if (displayBoxIndex < 0)
  		displayBoxIndex = oBoxCollection.length - 1;
  	var elem_class = "suggestion_hover";
  	oBoxCollection.removeClass(elem_class).eq(displayBoxIndex).addClass(elem_class);
  }

  $(".suggestion").live('mouseover', function(){
	  displayBoxIndex = $(this).index();
	  var elem_class = "suggestion_hover";
	  var oBoxCollection = $(".suggestion");
	  oBoxCollection.removeClass(elem_class).eq(displayBoxIndex).addClass(elem_class);  
  });  

// ------------------------------------------------------------------------------- 
// F U N C T I O N S    C A L L I N G    M E D I A W I K I    A P I
// -------------------------------------------------------------------------------   
  
	  var url='http://en.wikipedia.org/w/api.php?action=opensearch&search=';
		var url_query='http://en.wikipedia.org/w/api.php?format=json&action=query&list=search&srsearch=';
	  var url_google_img = 'http://ajax.googleapis.com/ajax/services/search/images?rsz=large&start=0&v=1.0&q=';
	  var query;
	  var arr_length = 0;
	  var search_results = [];
	  var ignore_keys_array = [18,20,17,40,35,13,27,36,45,37,93,91,34,33,39,16,9,38];
	  var mouse_is_inside = false;
	  var url_img_name = 'http://en.wikipedia.org/w/api.php?action=parse&prop=text&section=0&redirects&format=json&page=';
	  var img_src = '';
	  var text_preview = '';
	  var title_holder = '';
	  // Variables to store form field values for Submit:
	  var form_title = '';
	  var form_descr = '';
	  var form_url = '';
	  var form_image = '';  

// -------------------------------------------------------------------------------   
// Monitoring the keyUp action on the query textbox 
// ------------------------------------------------------------------------------- 
  $('#query').bind('keyup', function(e){
	  
	  //  Get value of query from the textbox			
	  query=$("#query").val();
	  if (query =='' || e.keyCode == 27){
	  	$("#results").empty(); }
	
	  //  If the user types in something and it is a valid key	
	  if (query != '' && ($.inArray(e.keyCode, ignore_keys_array) == -1) ){
  
		  //  Clear the suggestions
		  $("#results").empty();  
		  //  Initialize the suggestion box with a spinner		
		  $("#results").append('<img border="0" src="/images/system/spinner.gif" class="result-spinner"  />');
		  //  Talk to mediawiki API to fetch suggestions 
		  $.getJSON(url_query+encodeURIComponent(query)+'&callback=?',function(data){
		  	  
			  //  Limiting the suggestions to a maximum of 10
			  if (data.query.search.length <= 4) {
			  	arr_length = data.query.search.length - 1;
			  } else {
			  	arr_length = 4;
			  }
  
			  //  Clear the suggestions
			  $("#results").empty();
  
			  //  Loop through first 5 (maximum) suggestions and show 'em
			  for(var i = 0; i<=arr_length; i++){
			  	$("#results").append('<div class="suggestion" >'+data.query.search[i].title+'</div>');
  			  }   //  End of for loop
  		  }); //  End of getJSON function
  	   }  //  End of If structure
	}); // End of keyUp function 

// -------------------------------------------------------------------------------
// G E T    Q U E R Y    F R O M    S E A R C H - B O X
// -------------------------------------------------------------------------------
  $('.suggestion').live('click',function(){
	  $("#query").val($(this).html()); 
	  $("#results").empty();
	  displayBoxIndex = -1;
  });

// -------------------------------------------------------------------------------
// R E T R I E V E    C O N T E N T    F R O M    W I K I P E D I A
// -------------------------------------------------------------------------------  
  $("#btn_preview").click(function(){
	  if ($("#query").val()){
		  $("#results").empty();
		  $("#title_holder").html('');
		  // hide the save button
		  $('#form_container').css("display", "none");
		  // replace HTML of target Div
		  $('#text_holder ').html('');
		  $('#text_preview').removeAttr('style'); 
		  // show dummy image for image
		  $('#image_preview1, #image_preview2, #image_preview3, .check_clicked, .check_empty, .checkmsg').removeAttr('style');
		  parseJSON();
		  $("#results").empty();
	  }
  });

// -------------------------------------------------------------------------------
// P A R S E    T H E    R E C E I V E D    J S O N    C O N T E N T
// -------------------------------------------------------------------------------
  function parseJSON() {
	  // initialize spinner
	  $("#wait").html('<img border="0" src="/images/system/spinnef2f.gif"/>');    	
	  // create the json url
	  var queryRaw = $("#query").val()
	  var queryEncoded = encodeURIComponent(queryRaw);
	  var jsonData = (url_img_name + queryEncoded + "&callback=?")  
  
	  // parse the json
	  $.getJSON(jsonData, function (data) {
	  	// call the getJson function
	  	getContent(data);    
	  
	  	// remove spinner
	  	$("#wait").empty();
	  });
	 }
  
// -------------------------------------------------------------------------------  
// R E A D    T H E    P A R S E D    J S O N    F O R    C O N T E N T			
// -------------------------------------------------------------------------------  		
  function getContent(JData) {

      var Jval = JData.parse.text["*"];
	  	//  populate the description text
	  	text_preview = $(Jval.replace(/<p><br \/><\/p>/gi,'')).filter('p:first').text().replace(/\[\d+\]/gi,'');
	  
		  //  Throw error if no text was received
		  if(text_preview == ''){
		  	text_preview = "No data! Please try a different keyword."
  
	  	  //  If the search was successful - 
	  	} else {
	  		$("#title_holder").html(JData.parse.title);
  
		  	// shorten if beyond limit
		  	if(text_preview.length > 450){text_preview = text_preview.substring(0, 450) + '...';}
			  	// replace HTML of target Div
			  	$('#text_holder ').html(text_preview);
			  	$('#text_preview').css({'background-image':'none','height':'auto'});   
			  	form_descr = $("#text_holder ").html();
			  	// show the form 
			  	$("#form_container").css("display", "block");

			  	// find the image from Json
			  	img_src = $(Jval).find('img.thumbimage').attr('src');  
  
			  	// if image not found from wikipedia, get it from google
			  	if (img_src == null){

				  // retrieve JSON from google images search and pull the url for first image result
				  $.getJSON(url_google_img+encodeURIComponent($("#query").val())+'&callback=?', function(data) {
					  $.each(data.responseData.results, function(i,item){
					  	// replace HTML of target Div
					  	$('#image_preview' + (i+1)).css({'background-image': 'url("'+item.tbUrl+'")'});
					  	$('#image_preview2, #image_preview3, .check_empty, .checkmsg').show();
					  	//form_image = $('#image_preview1').html();
					  	if ( i == 2 ) return false;
					  	});  
				  });
  				  // Select the first image option by default	
  				  $(".check_clicked:first").show();
  
			  	// if the image was found from WIKIPEDIA itself, then just go ahead and use that.
			  	} else {
				  // replace HTML of target Div 
				  $('#image_preview1').css({'background-image': 'url("'+img_src+'")'});
				  form_image = $("#image_preview1 img:first").attr("src");
  
  				}  // END of If structure (checking for Image Success from Wikipedia)	  
  			}  // END of If structure (checking for Text Success from Wikipedia)
  }  // END of function  

// -------------------------------------------------------------------------------
// WHEN THE USER HITS CREATE IN THE CREATE NEW RELATIONSHIP DIALOG:
// -------------------------------------------------------------------------------
  $("#val_collector").live('click', function(){
	  // Call the function to show the spinner and make space if required
	  show_progress_message("creating relationship")
	  // Gather the values for the Form submission
	  valueCollect();
	  // Initialize the Modal
	  initialize_addNew();
	  close_addNew();
  	  // S U B M I T    T H E    F O R M
  	  ("form#relationship_form").submit();	  
	  return false;
  });

// -------------------------------------------------------------------------------
// Gather the values for the Form submission
// -------------------------------------------------------------------------------
  function valueCollect() {
	
	// 1.   I M A G E   U R L
  	if ($(".check_empty").is(":visible")) // If the radio buttons are shown (images coming from google)
  		{	// Filter out the radio button that was clicked
  			var clickedDiv = $(".check_clicked").filter(function() {
			return $(this).is(":visible")	
         });
  			// The Selected image Div
  			var selectedImgDiv = clickedDiv.parents(".img_prev")
  			$("#frm_img_url").val(extractUrl(selectedImgDiv.css("background-image")));
  		}
  	else	// If the image came from Wikipedia just get it from the first Div
  		{	$("#frm_img_url").val(extractUrl($("#image_preview1").css("background-image")));}
  
  	// 2.   W I K I P E D I A    U R L
  	$("#frm_wiki_url").val("http://en.wikipedia.org/wiki/" + ($("#title_holder").html().trim()).split(' ').join('_')); 
  	
  	// 3.   W I K I P E D I A    D E S C R I P T I O N 
  	$("#frm_descr").val(form_descr);
  	
  	// 4.   W I K I P E D I A    T I T L E 
	$("#frm_title").val($("#title_holder").html().trim());
  	
  }

// -------------------------------------------------------------------------------
// Extract the background-image url from the DIV
// -------------------------------------------------------------------------------
	function extractUrl(input)
  		{
  			return input.replace(/"/g,"").replace(/url\(|\)$/ig, "");
  		}

// -------------------------------------------------------------------------------
// FUNCTIONS TO INITIALIZE AND TOGGLE ADD_NEW MODAL
// -------------------------------------------------------------------------------	
	function close_addNew() {
	  $("#modal_form").removeAttr('style');			
	}
	
	function initialize_addNew(){
	  $('#image_preview1, #image_preview2, #image_preview3, .check_clicked, .check_empty, .checkmsg').removeAttr('style');
	  $('#text_holder ').html('');
	  $('#title_holder').html('');
	  $('#text_preview').removeAttr('style');
	  $("#wait").empty();
	  $('#form_container').css("display", "none");
	  $("#query").val('');
	  $("#frm_is_suggestion").val(''); 		
	}

// -------------------------------------------------------------------------------
// SELECT THE IMAGE FROM THE GOOGLE OPTIONS
// -------------------------------------------------------------------------------
	$(".check_empty").click(function(){
		$('.check_clicked').removeAttr('style');
		$(this).siblings('.check_clicked').show();
	});

// -------------------------------------------------------------------------------
// Close suggestions if clicked elsewhere
// -------------------------------------------------------------------------------	
  $('#results, #query').hover(function(){ 
	  mouse_is_inside=true; 
	  }, function(){ 
	  mouse_is_inside=false; 
  });

  $("body").mouseup(function(){ 
	  if(! mouse_is_inside) {
		  $("#results").empty();
		  $("#wait").empty(); 
		  displayBoxIndex = -1; }
  });

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

// -------------------------------------------------------------------------------
// Function to Retrieve image options from Google 
// -------------------------------------------------------------------------------

	$('.btn_image_edit').live('click', function(){
	  // Default inner HTML		
	  $(this).html('Edit Issue image');	
	  // Display the Modal for image options
	  $(".edit_image_modal").toggle();
	  
	  // If the form was opened:
	  if ($(".edit_image_modal").is(":visible")){
		  // retrieve JSON from google images search and pull the url for first image result
		  $.getJSON(url_google_img+encodeURIComponent($(".main_thumb_title").text())+'&callback=?', function(data) {
			  $.each(data.responseData.results, function(i,item){
			  	// replace HTML of target Div
			  	$('#image_edit_option' + (i+1)).css({'background-image': 'url("'+item.tbUrl+'")'});
			  	$('.check_empty_edit').show();
			  	if ( i == 2 ) return false;
			  	  // Show an up arrow	
				  				  	
			  	});  
			  // Select the first image option by default	
			  $(".image_edit_container_wait").hide();
			  $('.btn_image_edit').html('Edit Issue image &#9650;');
			  $(".image_edit_container").show();
			  $(".check_clicked_edit:first").show();
			  // Set the background of this first selected as the default value
			  $("#frm_img_update").val(extractUrl($("#image_edit_option1").css("background-image")))

		  });
		}
	});

// -------------------------------------------------------------------------------
// Set the value of the field in image update form based on selection
// -------------------------------------------------------------------------------
	$(".check_empty_edit").live('click', function(){
		$('.check_clicked_edit').removeAttr('style');
		// Show selection
		$(this).siblings('.check_clicked_edit').show();
		// Update field value in the form accordingly
		$("#frm_img_update").val(extractUrl($(this).parents(".image_edit_option").css("background-image")))
	});

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// S U G G E S T I O N S     M E D I A W I K I     D A T A 
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

	var queryEncoded_sugg = ""
	var suggestion_thumb_to_update
	
	$(".suggestion_thumb").live('click', function(){
		// Opacity changes to highlight the one that is clicked
		$('.relationship_thumb').not($(this)).animate({'opacity': '0.3'});
		$(this).animate({'opacity': '1'});
		
		// Hide Linkout class if shown anywhere 		
		$(".issue_linkout").removeAttr('style');
		
		// Remove any existing stle attributes/backgrounds from the thumbnails
		$(".relationship_thumb_suggestion").removeAttr('style').removeClass('suggestion_selected');		
		$(".relationship_thumb").removeClass('selected_relationship_thumb');
		$(".suggestion_thumb").removeClass('selected_suggestion_thumb');
		$(this).addClass('selected_suggestion_thumb');

		// initialize the relationship
		$("#get_rel_issueid_input").val($("#issue_id_store").text().trim());
		// Show the message
		show_progress_message("loading content from Wikipedia")
	 	
	 	// DOM object for the thumbnail that will be updated
	 	suggestion_thumb_to_update = $(this).children(".relationship_thumb_suggestion")
	 	
	 	// Form query
	 	var queryRaw_sugg = $(this).children(".relationship_suggestion_title").text().trim()
	    var queryEncoded_sugg = encodeURIComponent(queryRaw_sugg);
	    var jsonData_sugg = (url_img_name + queryEncoded_sugg + "&callback=?") 		
		
		// Call ParseJSON fn
		parseJSON_sugg(jsonData_sugg);
	});

// -------------------------------------------------------------------------------
// P A R S E    T H E    R E C E I V E D    J S O N    C O N T E N T
// -------------------------------------------------------------------------------
  function parseJSON_sugg(jsonData_sugg) {
	// parse the json
	  $.getJSON(jsonData_sugg, function (data_sugg) {
	  	// call the getJson function
	  	getContent_sugg(data_sugg);
	  	// remove progress message
	  	hide_progress_message();
	  	// trigger the mouseout finction on suggestion_thumb
	  	$(".suggestion_thumb:not(.selected_suggestion_thumb)").trigger('mouseout');
	  });
	 }
  
// -------------------------------------------------------------------------------  
// R E A D    T H E    P A R S E D    J S O N    F O R    C O N T E N T			
// -------------------------------------------------------------------------------  		
  function getContent_sugg(JData_sugg) {

      var Jval_sugg = JData_sugg.parse.text["*"];
	  	//  populate the description text
	  	text_preview = $(Jval_sugg.replace(/<p><br \/><\/p>/gi,'')).filter('p:first').text().replace(/\[\d+\]/gi,'');
	  
		  //  Throw error if no text was received
		  if(text_preview == ''){
		  	text_preview = "No data! Please try a different keyword."
  
	  	  //  If the search was successful - 
	  	} else {
	  		if(text_preview.length > 450){text_preview = text_preview.substring(0, 450) + '...';}
	  		
	  		// Make the Causal sentence 
	  		$("#title_issue").html($(".main_thumb_title").text().trim());
	  		// call function to identify what should be the causal sentence?
	  		write_causal_sentence($(".central_causality_container").text().trim())
			$("#title_relationship").html(JData_sugg.parse.title); 
			$("#title_dynamic_text").removeAttr('style');
		  	
		  	// Hide the Divs that are not required
			$(".relation_controls, .relation_discussion").hide();
			
			// Show the Divs and replace HTML
			$("#system_generated").show();
			$('#relationship_title_dynamic').html(JData_sugg.parse.title + ":");
			$('.rationale_headers:first').html('Wikipedia Description');
			$('#relationship_descr_dynamic').html(text_preview);  
			$('#relationship_linkout_dynamic').html('<img class="linkout" src="/images/system/linkout.png">')
			var linkSrc = "http://en.wikipedia.org/wiki/" + (JData_sugg.parse.title).split(' ').join('_');
			$('#relationship_link_dynamic').html('<a href="' + linkSrc + '" target="_blank">more on Wikipedia</a>');
			  	
			// find the image from Json
			img_src = $(Jval_sugg).find('img.thumbimage').attr('src');  
			
			// if image not found from wikipedia, get it from google
			if (img_src == null){
					
				  var google_imgquery = encodeURIComponent(JData_sugg.parse.title)
				  // retrieve JSON from google images search and pull the url for first image result
				  $.getJSON(url_google_img + google_imgquery + '&callback=?', function(data_sugg) {
					  $.each(data_sugg.responseData.results, function(i,item){
					  	// replace HTML of target Div
					  	suggestion_thumb_to_update.css({'background-image': 'url("'+item.tbUrl+'")'}).addClass('suggestion_selected');
					  	if ( i == 1 ) return false;
					  	});  
					 // Show the accept or reject buttons once images are loaded
					 suggestion_thumb_to_update.siblings(".issue_linkout").fadeIn(); 	
				  });
  
			  	// if the image was found from WIKIPEDIA itself, then just go ahead and use that.
			  	} else {
				  // replace HTML of target Div 
				  suggestion_thumb_to_update.css({'background-image': 'url("'+img_src+'")'}).addClass('suggestion_selected');
				 // Show the accept or reject buttons once images are loaded
				 suggestion_thumb_to_update.siblings(".issue_linkout").fadeIn();  
  				
  				}  // END of If structure (checking for Image Success from Wikipedia)	  
  			}  // END of If structure (checking for Text Success from Wikipedia)
  }  // END of function



	function write_causal_sentence(current_sentence){

	switch (current_sentence) { 
	  case 'is caused by':
		$("#title_causality").html('may be caused by')
		$("#frm_action").val('C')
	  break;
	  case 'causes':
		$("#title_causality").html('may cause')
	  	$("#frm_action").val('E')
	  break;
	  case 'is reduced by':
		$("#title_causality").html('may be reduced by')
		$("#frm_action").val('I')
	  break;
	  case 'reduces':
		$("#title_causality").html('may reduce')
		$("#frm_action").val('R')
	  break;
	  case 'is a superset of':
		$("#title_causality").html('may be a superset of')
		$("#frm_action").val('S')
	  break;
	  case 'is a subset of':
		$("#title_causality").html('may be a subset of')
		$("#frm_action").val('P')
	  break;
	  }
		
		$("#title_causality").addClass('suggested_causality')
		
	}

// -------------------------------------------------------------------------------
// ACCEPT SUGGESTION
// -------------------------------------------------------------------------------
	$(".suggestion_accept").live('click', function(){
	  	// Call the function to show the spinner and make space if required
	  	show_progress_message("confirming suggestion as accepted")
		// collect the form values
		sugg_valueCollect();
		// Submit the form
		$.post($("#new_issue").attr("action"), $("#new_issue").serialize(), null, "script");

		return false;
	});

	function sugg_valueCollect(){
		// 1.   I M A G E   U R L
	  	$("#frm_img_url").val(extractUrl(suggestion_thumb_to_update.css("background-image")));
	  	// 2.   W I K I P E D I A    U R L
	  	$("#frm_wiki_url").val($("#relationship_link_dynamic a").attr('href')); 
	  	// 3.   W I K I P E D I A    D E S C R I P T I O N 
	  	$("#frm_descr").val($("#relationship_descr_dynamic").text().trim());
	  	// 4.   W I K I P E D I A    T I T L E 
	  	var title_raw    = $("#relationship_title_dynamic").text().trim()
	  	var title_sliced = title_raw.substring(0, title_raw.length - 1)
		$("#frm_title").val(title_sliced);
		// 5.   C A U S A L I T Y    T Y P E
		// ALREADY POPULATED ABOVE
		// 6.   I S S U E    I D
		$("#frm_type_id").val($("#issue_id_store").text().trim());
		// P A S S    S U G G E S T I O N    I D    P A R A M
		$("#frm_is_suggestion").val(suggestion_thumb_to_update.siblings(".suggestion_id_store").text().trim())
	
	}
	
// -------------------------------------------------------------------------------
// RETURN FALSE ON CLICK OF REJECT SUGGESTION
// -------------------------------------------------------------------------------
	$(".suggestion_reject").live('click', function(){
	  	// Call the function to show the spinner and make space if required
	  	show_progress_message("removing suggestion")		
		return false;
	})

// -------------------------------------------------------------------------------
// FUNCTIONS FOR SHOWING AND HIDING PROGRESS MESSAGES
// -------------------------------------------------------------------------------
	function show_progress_message(msg){
		var spinner_html = '<img src="/images/system/spinnerf6.gif" class="progress_spinner"/>'
		$("#progress_message").html(spinner_html + msg);
		$("#progress_container").show();		
	}

	function hide_progress_message(){
		$("#progress_message").html('');
		$("#progress_container").hide();		
	}


// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||	
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||  
//******************   E N D    O F    D O M    L O A D   ************************
});
// *******************************************************************************
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||


  // I N I T I A L    F O R M A T T I N G / P R O C E S S I N G
  
  /* (0.) Align the blobs and arrows Correctly based on height of the Issueblock
  $('img.wikiimage').ready(function(){
  var block_height = $('.issueblock').height();
  var arrow_height = $('.arrow-carrier-right').height();
  var blob_height  = $('.blob-carrier').height();
  var right_height = $('.arrow-leftward').height();
  
  var arrow_marg_top = (block_height - arrow_height)/2
  var blob_marg_top  = (block_height - blob_height - 42)/2
  var right_marg_top = (block_height - right_height - 40)/2 
  
  $('.arrow-carrier-right, .arrow-carrier-left').animate({'margin-top': arrow_marg_top});
  $('.blob-carrier').animate({'margin-top': blob_marg_top});
  $('.arrow-leftward').animate({'margin-top': right_marg_top});
  /$(".blue_banner").effect("highlight", {color: '#4DB8DB'}, 1000);
  
  // Ensure that the height of Map remains same as the rest of the content
  var mapcontainer_height = $('.wikicontent').height();
  $('#map_canvas').css({'height': mapcontainer_height});
  });
  // (3.) Show or Hide the Suggestion Scroll buttons if required

  if ($(".cause_carousel").height() > 30){
  $(".cause_scroller").css({display : 'inline'});
  }

  if ($(".effect_carousel").height() > 30){
  $(".effect_scroller").css({display : 'inline'});
  }

  if ($(".inhibitor_carousel").height() > 30){
  $(".inhibitor_scroller").css({display : 'inline'});
  }
  
  if ($(".inhibited_carousel").height() > 30){
  $(".inhibited_scroller").css({display : 'inline'});
  }
    

  // (4.) Show or Hide the Accepted Scroll buttons if required
  if ($(".accepted_causes").height() > 64){
  $(".cause_scroll").css({display : 'block'});
  }

  if ($(".accepted_effects").height() > 64){
  $(".effect_scroll").css({display : 'block'});
  }

  if ($(".accepted_inhibitors").height() > 64){
  $(".inhibitor_scroll").css({display : 'block'});
  }

  if ($(".accepted_inhibited").height() > 64){
  $(".inhibited_scroll").css({display : 'block'});
  }  
  // S M O O T H    D I V    S I Z E    T R A N S I T I O N S (this is cool!)

  // Animates the dimensional changes resulting from altering element contents
  // Usage examples: 
  //    $("#myElement").showHtml("new HTML contents");
  //    $("div").showHtml("new HTML contents", 400);
  //    $(".className").showHtml("new HTML contents", 400, 
  //                    function() {/* on completion *//*});
  (function($)
  {
  $.fn.showHtml = function(html, speed, callback)
  {
  return this.each(function()
  {
  // The element to be modified
  var el = $(this);

  // Preserve the original values of width and height - they'll need 
  // to be modified during the animation, but can be restored once
  // the animation has completed.
  var finish = {width: this.style.width, height: this.style.height};

  // The original width and height represented as pixel values.
  // These will only be the same as `finish` if this element had its
  // dimensions specified explicitly and in pixels. Of course, if that 
  // was done then this entire routine is pointless, as the dimensions 
  // won't change when the content is changed.
  var cur = {width: el.width()+'px', height: el.height()+'px'};

  // Modify the element's contents. Element will resize.
  el.html(html);

  // Capture the final dimensions of the element 
  // (with initial style settings still in effect)
  var next = {width: el.width()+'px', height: el.height()+'px'};

  el .css(cur) 
  el .animate(next, speed, function()  // animate to final dimensions
  {
  el.css(finish); // restore initial style settings
  if ( $.isFunction(callback) ) callback();
  });
  });
  };
  })(jQuery);  
  
  */
