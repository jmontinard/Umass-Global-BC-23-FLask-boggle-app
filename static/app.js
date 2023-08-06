
const board = $('#boggle') 
const wordTracker = new Set()
let seconds = 60
let gameScore = 0



timer = setInterval(tick, 1000)


function showMessage(msg, cls) {
    $(".msg", board)
      .text(msg)
      .removeClass()
      .addClass(`msg ${cls}`);
  }


async function handleWordSubmit(e) {
    e.preventDefault();
  
    
    const word = $('.word', board);

    let wordVal = word.val()
    if (!wordVal) return;

    if (wordTracker.has(wordVal)) {
       showMessage(`Already found ${wordVal}`, "err");
      return;
    }



    const response = await axios.get('/word-checker', {params: {word:wordVal}})

    if(response.data.result === 'not-word'){
        showMessage(`${wordVal} is not a valid English word`, "err");
     
    }else if (response.data.result === "not-on-board"){
        showMessage(`${wordVal} is not a valid word on this board`, "err")
    } else {
        $(".words", board).append($("<li>", { text: wordVal }));

        gameScore += wordVal.length
        $(".score", board).text(gameScore);

        showMessage(`Added: ${wordVal}`, "ok")

    }
    
    word.val("").focus();

}
function showTimer() {
    $(".timer", board).text(seconds);
  }

async function tick() {
    seconds -= 1;
    showTimer();

    if (seconds === 0) {
      clearInterval(timer);
      await scoreGame();
    }
  }

async function scoreGame() {
    $(".addWord", board).hide();
    const resp = await axios.post("/post-score", { score: gameScore });
    if (resp.data.brokeRecord) {
    showMessage(`New record: ${gameScore}`, "ok");
    } else {
      showMessage(`Final score: ${gameScore}`, "ok");
    }
  }


  
  
  async function handleTest(evt) {
    evt.preventDefault()
    
    const $word = $(".word", board);
    
    let word = $word.val();
    
    const resp = await axios.get("/word-checker", { params: { word: word }});
    
    console.log(resp);
  }
  
  $('.addWord', board).on("submit", handleWordSubmit)