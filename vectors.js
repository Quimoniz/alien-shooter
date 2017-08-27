class Vector2
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

        return this;
    }

    Subtract(param1, param2)
    {
        //If only 1 argument then assume its a vector2 and if not 2 numbers are given
        if(typeof param2 == "undefined") 
        {
            this.x -= param1.x;
            this.y -= param1.y;
        }
        else {
            this.x -= param1;
            this.y -= param2;
        }

        return this;
    }

    Normalize()
    {
        if(this.isZero)
        {
            return this;
        }
        else
        {
            var curLength = this.length;

            this.x = (this.x/curLength);
            this.y = (this.y/curLength);

            return this;
        }
    }

    get Normalized()
    {
        if(this.isZero) 
        {
            return this;
        }
        else
        {
            var curLength = this.length;

            var output = new Vector2(this.x/curLength, this.y/curLength);

            return output;
        }
    }

    //The x and y will be changed
    Multiply (factor)
    {
        this.x *= factor;
        this.y *= factor;

        return this;
    }
    //The Vector itself remains unchanged
    MultiplyNoChanges(factor)
    {
        return new Vector2(this.x * factor, this.y * factor);
    }

    Divide(factor)
    {
        this.x /= factor;
        this.y /= factor;

        return this;
    }

    ToRad()
    {
        return Math.atan2(this.y, this.x);
    }

    Output(optionalText)
    {
        console.log(optionalText + ": (" + this.x + "|" + this.y + ")");
    }

    clone()
    {
        return new Vector2(this.x, this.y);
    }

    static RadToVector(rad)
    {
        return new Vector2(Math.cos(rad), Math.sin(rad));
    }

    static VectorToRad(x, y)
    {
        return Math.atan2(y, x);
    }

    get length()
    {
        return Math.sqrt((Math.pow(this.x, 2) + Math.pow(this.y , 2)));
    }

    get isZero()
    {
        return (this.x == 0 && this.y == 0)?true:false;
    }
}

