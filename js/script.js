'use strict '; (function() {
    var prefix = "https://cors-anywhere.herokuapp.com/";
    /*adres URL do wysyłania tweetów */
    var tweetLink = "https://twitter.com/intent/tweet?text=";
    /*adres URL do pobierania cytatów */
    var quoteUrl = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
    var button = $('.trigger');
    /*Pobieranie cytatu */
    /*$.ajax({
    dataType: "json",
    url: quoteUrl,
    data: null,
    success: createTweet
    }); to samo metod */
    function getQuote() {
        $.getJSON(prefix + quoteUrl, createTweet);
    };
    /*quoteUrl- adres zapytania (czyli nasz link do API),
    createTweet- funkcja, która zostanie wykonana przy pomyślnym wykonaniu zapytania. */
    $.ajaxSetup({
        cache: false
    });;
    /*
    Tworzenie tweeta
    Funkcja createTweet() ma za zadanie tworzyć linki z tweetami i podpinać je pod przycisk do tweetowania. Będziemy sukcesywnie dopisywać kolejne fragmenty tej funkcji.
     Zacznijmy od sprawdzenia autora cytatu: */
    function createTweet(input) {
        var data = input[0];
        var quoteText = $(data.content).text().trim();
        /* data.content-jest to zwykły kod HTML paragrafu. 
                                                            Niestety, nie jest to ten format danych, o jaki nam chodzi - w związku z tym za pomocą 
                                                            jQuery tworzymy element HTML na podstawie HTML z tego klucza, 
                                                            a następnie wyciągamy z niego zawartość tekstową za pomocą metody .text()
                                                            .trim()-pozwola 'uciąć' niepotrzebne spacje na początku/końcu stringa.
                                                            Jeśli autor cytatu jest pustym stringiem (jego długość jest równa 0), to w pole autora należy wpisać "Unknown author"*/
        var quoteAuthor = data.title;
        if (!quoteAuthor.length) {
            quoteAuthor = "Unknown author";
        }
        /*Konstrukcję !quoteAuthor.length JavaScript potraktuje jako true. Dzieje się to w następujący sposób:
            
        quoteAuthor.length zwróci wartość 0 w przypadku, gdy autor cytatu będzie pusty - JavaScript interpretuje zerową długość jako po prostu false.
        Wykrzyknik na początku (!quoteAuthor.length) zaneguje wartość fałszu i zrobi z niej prawdę, czyli jeśli autor cytatu jest pusty, to wejdziemy do treści warunku. */
        /*wygenerowanie treści tweeta - pamiętaj, aby koniecznie umieścić deklarację tej zmiennej poza warunkiem if, 
        który pisaliśmy wcześniej - w przeciwnym wypadku otrzymasz błąd o niezdefiniowanej zmiennej.  */
        var tweetText = "Quote of the day - " + quoteText + " Author: " + quoteAuthor;
        /*prawdzić, czy nie wykraczamy przypadkiem poza maksymalną długość 140 znaków */
        if (tweetText.length > 140) {
            getQuote();
        } else {
            var tweet = tweetLink + encodeURIComponent(tweetText); /* zmienna tweet*/
            $('.quote').text(quoteText); /*$('.quote') to element, w którym wyświetlamy treść naszego cytatu */
            $('.author').text("Author: " + quoteAuthor); /*$('.author') jest elementem, w którym pokazujemy autora cytatu. */
            $('.tweet').attr('href', tweet);
            button.prop('disabled', false);/*jak nacisniemy przycisk to przeskakuje n tweeta i pokzuje sie cytat */
            /*Wybieramy w niej element z klasą .tweet 
                   i modyfikujemy zawartość atrybutu href na URL tweeta, który trzymany jest w zmiennej tweet. */
        }
    };
    $(document).ready(function() {
    getQuote();
    $('.trigger').click(function() {
        button.prop('disabled', true);
        getQuote();
    })
});

})();