// <reference path="types.ts" />


export interface ValidationInfo
{
    errmsg?: string;
}

// lat, lng format
function validLocation(loc: Vector2D): boolean
{
    if (!loc || !loc.x || !loc.y) return false;
    if (isNaN(loc.x) || isNaN(loc.y)) return false;
    return -90 < loc.x && loc.x < 90 && -180 < loc.y && loc.y < 180;
}

function validateEmail(email: string, info: ValidationInfo[] = []): boolean
{
   var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
   var res: boolean = re.test(email);
   if (!res) info.push({errmsg: "Wrong email format"});
   return res;
}

function validatePassword(password: string, info: ValidationInfo[] = []): boolean
{
    var res = true;
    if (password.length <= 4) { info.push({errmsg: "Minimum password length is 4"}); res = false; }
    return res;
}

export namespace MessageFindPost
{
    export function validate(payload: MessageFindPost): boolean
    {
        return typeof payload.uid == "string";
    }
}

export namespace MessageNewPost
{
    export function message(msg: string, info: ValidationInfo = {}): boolean
    {
        if (msg.length > 500)
        {
            info.errmsg = "Message too long.";
            return false;
        }
        if (msg.trim().length < 2)
        {
            info.errmsg = "Message too short.";
            return false;
        }
        return true;
    }

    export function nickname(nick: string, info: ValidationInfo = {}): boolean
    {
        if (nick.length < 4)
        {
            info.errmsg = "Username has to be at least 4 characters long.";
            return false;
        }

        if (nick.length > 20)
        {
            info.errmsg = "Username too long. Max 20 characters.";
            return false;
        }

        var tnick = nick.trim();
        var regex = new RegExp("^[a-zA-Z0-9 .]+$");

        if (!regex.test(tnick))
        {
            info.errmsg = "Only letters and numbers are allowed in the nickname.";
            return false;
        }
        return true;
    }

    export function validate(payload: MessageNewPost): boolean
    {
        if (!message(payload.message)) return false;
        if (!nickname(payload.nickname)) return false;
        if (!validLocation(payload.location)) return false;
        return true;
    }
}

export namespace MessageGeocode
{
    export function validate(payload: MessageGeocode): boolean
    {
        if (payload.length > 200) return false;
        return true;
    }
}

export namespace MessageRevGeocode
{
    export function validate(payload: MessageRevGeocode): boolean
    {
        return validLocation(payload);
    }
}

export namespace MessageIsUpvoted
{
    export function validate(payload: MessageIsUpvoted): boolean
    {
        return typeof payload.responseChannel == "string" && typeof payload.postid == "string";
    }
}

export namespace MessageUpvotePost
{
    export function validate(payload: MessageUpvotePost): boolean
    {
        return typeof payload == "string";
    }
}

export namespace MessageRemoveUpvotePost
{
    export function validate(payload: MessageRemoveUpvotePost): boolean
    {
        return typeof payload == "string";
    }
}

export namespace MessageUsetSearchDistance
{
    export function validate(payload: MessageUsetSearchDistance): boolean
    {
        return typeof payload == "number";
    }
}

export namespace MessagePollPosts
{
    export function validate(payload: MessagePollPosts): boolean
    {
        if (!payload.filter) return false;
        if (!(typeof payload.filter.getOlder == "boolean")) return false;
        if (!validLocation(payload.filter.location)) return false;
        if (!(typeof payload.responseChannel)) return false;
        if (<any>(new Date(<any>payload.filter.fromTime)) == "Invalid Date") return false;
        return true;
    }
}

export namespace MessageRegisterAndLogin
{
    export function validate(payload: MessageRegisterAndLogin, info: ValidationInfo[] = []): boolean
    {
        return validateEmail(payload.email, info) && validatePassword(payload.password, info);
    }
}