class Vektor2 
{

    constructor (x, y)
    {
        this.x = x;
        this.y = y;
    }

    Add(param1, param2)
    {
        //If only 1 argument then assume its a vector2 and if not 2 numbers are given
        if(typeof param2 == "undefined") 
        {
            this.x += param1.x;
            this.y += param1.y;
        }
        else {
            this.x += param1;
            this.y += param2;
        }
    }

    Normalize()
    {
        var curLength = this.length;

        this.x = (this.x/curLength);
        this.y = (this.y/curLength);
    }

    Output(optionalText)
    {
        console.log(optionalText + ": (" + this.x + "|" + this.y + ")");
    }

    get length()
    {
        return Math.sqrt((Math.pow(this.x, 2) + Math.pow(this.y , 2)));
    }
}