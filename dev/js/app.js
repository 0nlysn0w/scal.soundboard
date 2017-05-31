var id = 5; // For online demo only

$(document).ready( function() {
    $('.no-fouc').removeClass('no-fouc'); // FOUC solution
    $('.modal').modal(); // Initialize the modal classes
    
    // loadSoundTiles();
    volumeListener();
    newSoundTile();
    deleteSoundTile();
    playSoundTile();
    
    // Nav links
    $("#faq-link").click(function() {
        $('html, body').animate({
            scrollTop: $("#faq").offset().top + 32
        }, 750);
    });
    
    $("#about-link").click(function() {
        $('html, body').animate({
            scrollTop: $("#about").offset().top + 32
        }, 1500);
    });
});


/*
    loadSoundTiles()
    
    Load any sound tiles if they exist in localStorage.
    Does nothing if there's nothing to load.
    
    For online demo: Is never called
    For standalone: Is called on pageload before anything else
*/
function loadSoundTiles() {
    // Only attempt to load if there's actually data to load
    if ( localStorage.length > 0 ) {
        for ( var i = 0; i < localStorage.length; i++ ) {
            // Parse the value as an object
            var soundTile = JSON.parse( localStorage.getItem( localStorage.key( i ) ) );
            createSoundTile( soundTile.id, soundTile.name, soundTile.fileName, soundTile.color );
        }
    }
}


/*
    createSoundTile( id, name, fileName, color )
    
    Actually create a sound tile. Places it in the DOM.
    
    For online demo: Only adds to the DOM (no LS)
    For standalone: Adds to DOM and saves to LS
*/
function createSoundTile( id, name, fileName, fileActual, color ) {
    var soundTileElement =
        '<div class="col s6 m3 l2 sound-tile" id="' + id + '">' +
        '<div class="sound-tile__player sound-tile__player--' + color + ' waves-effect waves-light"></div>' +
        '<a href="#editSoundTileModal" class="sound-tile__edit"><div class="sound-tile__label sound-tile__label--' + color + ' waves-effect waves-light"></div></a>' +
        '<audio class="sound-tile__sound"></audio></div>';
    
    // Append the entire element to the sound grid container
    $('.sound-grid__container').append(soundTileElement);
    
    // A way of escaping any quotes or single quotes in the name
    $('#' + id + ' .sound-tile__label').text(name);
    
    // Add a local reference to the sound file
    $('#' + id + ' .sound-tile__sound').attr('src', URL.createObjectURL(fileActual));
    playSoundTile();
    deleteSoundTile();
    adjustVolume();
}


/*
    volumeListener()

    Whenever the volume slider is adjusted, the volume properties of all
    audio objects is set.
*/
function volumeListener() {
    $('#volumeSlider').on("input", function() {
        var globalVolume = $('#volumeSlider').val() / 100;
        
        var audioPlayers = document.getElementsByTagName('audio');
        if ( audioPlayers ) {
            for ( var i = 0; i < audioPlayers.length; i++ ) {
                audioPlayers[i].volume = globalVolume;
            }
        }
    });
}

/*
    adjustVolume()

    Whenever a new tile is added, its volume is set using this
*/
function adjustVolume() {
    var globalVolume = $('#volumeSlider').val() / 100;
        
    var audioPlayers = document.getElementsByTagName('audio');
    if ( audioPlayers ) {
        for ( var i = 0; i < audioPlayers.length; i++ ) {
            audioPlayers[i].volume = globalVolume;
        }
    }
}
    
    
/*
    playSoundTile()

    Whenever a sound tile player is pressed, play the associated sound
*/
function playSoundTile() {
    $('.sound-tile__player').click( function() {
        $(this).siblings('.sound-tile__sound')[0].currentTime = 0;
        $(this).siblings('.sound-tile__sound')[0].play();
    });
}


/*
    newSoundTile()
    
    Upload a new sound tile. Will be saved to localStorage if it is offline
    Currently does not save if it is offline (todo)
*/
function newSoundTile() {
    $('.sound-tile-modal__add-btn').click( function() {
        var fileName = document.getElementById('newSoundTileFileName').files[0].name;
        var fileActual = document.getElementById('newSoundTileFileName').files[0];
        var name = document.getElementById('newSoundTileName').value;
        var color = getRandomColorString();
        var id = generateID();
        createSoundTile( id, name, fileName, fileActual, color );
    });
}


/* 
    getRandomColorString()
    
    Returns a random color string. Is one of the 6 material design colors used.
*/
function getRandomColorString() {
    var min = Math.ceil(1);
    var max = Math.floor(6);
    var color = Math.floor(Math.random() * (max - min + 1)) + min; // inclusive on both ends
    switch (color) {
        case 1:
            return "pink";
        case 2:
            return "purple";
        case 3:
            return "blue";
        case 4:
            return "green";
        case 5:
            return "teal";
        default:
            return "orange";
    }
}


/*
    generateID()
    
    Returns a valid ID that's compatible with localStorage.
    This ID must be unique within localStorage and the DOM.
    
    For online demo: IDs are just for user-uploaded tiles
    For standalone: IDs are actually important and saved in local storage
*/
function generateID() {
    // Only attempt to load if there's actually data to load
    if ( localStorage.length > 0 ) {
        var stIDs = [];
        // Iterate through each key (sound tiles) and get the IDs
        for ( var i = 0; i < localStorage.length; i++ ) {
            // Parse the value as an object
            var soundTile = JSON.parse( localStorage.getItem( localStorage.key( i ) ) );
            var soundTileID = parseInt( soundTile.id.substr(3) );
            stIDs.push(soundTileID);
        }
        
        // Iterate through each possible ID until an opening is found
        for( id = 0; ; id++ ) {
            if ( !stIDs.includes(x) ) {
                return "st-" + id;
            }
        }
    }
    // For online version (no localStorage), just enumerate ID by 1 everytime
    else {
        id++;
        return "st-" + id;
    }
}


/* 
    deleteSoundTile()
    
    Delete a sound tile.
    
    For online demo: Will only edit the DOM (no LS)
    For standalone: Will edit the DOM and save changes to LS
*/
function deleteSoundTile() {
    $('.sound-tile__edit').click( function() {
        
        var editSoundTileID = $(this).parent().attr('id');
        
        var editSoundTileName = $('#' + editSoundTileID + ' .sound-tile__label').text();
        
        $('.edit-modal p').text('Are you sure you want to delete this sound tile (' + editSoundTileName + ')?')
    
        $('.sound-tile-modal__edit-btn').click( function() {
            $('#' + editSoundTileID ).css('display', 'none');
        });
    });
}
