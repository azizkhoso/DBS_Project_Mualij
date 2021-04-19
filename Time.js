class Time{
    constructor(hrs=0, min=0, sec=0){
        this.min = Number.parseInt(min);
        this.sec = Number.parseInt(sec);
        this.hrs = Number.parseInt(hrs);

        this.toSeconds = () =>{
            return this.hrs*60*60 + this.min*60 + this.sec;
        }
        this.getMinutes = () =>{
            return this.min;
        }
        this.getSeconds = () =>{
            return this.sec;
        }
        this.setMinutes = (min) =>{
            this.min = min;
        }
        this.setSeconds = (sec) =>{
            this.sec = sec;
        }
        this.setHours = (hrs) =>{
            this.hrs = hrs;
        }
        this.getHours = function(){
            return this.hrs;
        }

        this.compare = (time) =>{
            return this.toSeconds()-time.toSeconds()>0 ? 1 : -1;
        }
        this.toString24 = () =>{
            return this.hrs + ':'+this.min;
        }
        this.toFullString = () =>{
            return this.hrs + ':'+this.min+':'+this.sec;
        }
        this.toString12 = () =>{
            if(this.hrs>12){
                if(this.min==0) return (this.hrs-12) +'PM';
                return (this.hrs-12) + ':'+this.min+'PM';
            }
            else{
                if(this.min==0) return (this.hrs) +'AM';
                return this.hrs + ':'+this.min+'AM';
            }
        }
    }
    static parse(timeString){
        let time = timeString.split(':');
        if(time.length==1) return null;
        if(time.length==2){
            return new Time(time[0], time[1], 0);
        }
        if(time.length==3){
            return new Time(time[0], time[1], time[2]);
        }
        if(time.length>3) return null;
    }
}

module.exports = Time;