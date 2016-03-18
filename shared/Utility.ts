// <reference path="types.ts" />

export namespace Utility {

    export function triggerOnDef(value: () => any, timeoutMS: number, callback: () => void): void
    {
        var checker = setInterval(() => {
            if (value())
            {
                clearInterval(checker);
                callback();
            }
        }, 50);

        setTimeout(() => clearInterval(checker), timeoutMS);
    }

    export function extractLinks(text: string) {
        var source = (text || '').toString();
        var urlArray: string[] = [];
        var matchArray: string[];

        // Regular expression to find FTP, HTTP(S) and email URLs.
        var regexToken = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

        // Iterate through any URLs in the text.
        while( (matchArray = regexToken.exec( source )) !== null )
        {
          var token = matchArray[0];
          urlArray.push( token );
        }

        return urlArray;
    }

    export function replaceAll(text: string, pattern: string, repl: string): string {
        return text.split(pattern).join(repl);
    }

    export function getOgFromMessage(text: string, callback: (meta: any) => void): void
    {
        var exurls = extractLinks(text);
        if (exurls.length <= 0) return null;

        $.get("/open-graph", {url: exurls[0]}, (res) => {
            if (res.length > 0)
                callback(JSON.parse(res));
        });
    }

    export function sanitizeMessage(text: string): string
    {
        var e = $("<div>").text(text);
        var escaped = e.html();
        var exurls = extractLinks(text);
        for (var i = 0; i < exurls.length; ++i)
        {
            escaped = replaceAll(escaped, $("<div>").text(exurls[i]).html(),
                "<a href='" + encodeURI(exurls[i]) + "' target='_blank'>" + $("<div>").text(exurls[i]).html() + "</a>");
        }

        return escaped;
    }
}