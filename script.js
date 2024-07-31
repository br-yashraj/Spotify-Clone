console.log('Lets write javascript')

let currentSong = new Audio();
let songs;


function convertSecondsToMinutes(seconds) {
    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(){
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}


const playMusic = (track, pause=false)=>{
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".song-info").innerHTML = decodeURI(track)
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00"

}

async function main(){
    // Get the list of all songs
    songs = await getSongs()
    playMusic(songs[0], true)

    // Show all the songs in the Playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")} </div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
            <img class="invert" src="play.svg" alt="">
        </div>        
        </li>`;
    }

    // Attach an evenlistener to each songs
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    // Attach an event Listener to play, next and Previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // Listen for time update event
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".song-time").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)* 100 + "%"
    })

    // Add an event Listener to seekbar
    document.querySelector(".seekBar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)* 100;
        document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)* 100 + "%";
        currentSong.currentTime = ((currentSong.duration)* percent)/100;
    })
    /* Add an event listener to hamburger*/
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left=0;
    })

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    // add an event listner to previous & next
    previous.addEventListener("click", ()=>{
        console.log("Previos Clicked")
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        
        if((index-1) >= 0){
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", ()=>{
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        
        if((index+1) < songs.length){
            playMusic(songs[index + 1])
        }

    })

} 
main()