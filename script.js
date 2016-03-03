

d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows) {

    //console.log(rows);

//top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration. Log the array of these trips in console.

//First: setting up the crossfilter
    var crossFilter = crossfilter(rows);
console. log (rows);

//#1: total number of trips in 2012
    var start2012 = new Date ('January 01, 2012 00:00:00'),
        end2012 = new Date ('December 31, 2012 23:59:59');

    var tripsByYear = crossFilter.dimension(function(rows) { return rows.startTime; });
    tripsIn2012 = tripsByYear.filter([start2012, end2012]).top(Infinity); // selects dates that are between the two variables we selected right on top

    console.log("trips in 2012", tripsIn2012.length);

//#2 trips in 2012 that are taken by males
    var tripsByGender = crossFilter.dimension(function(rows){ return rows.sex; });
    tripsByGuys = tripsByGender.filter("Male").top(Infinity); //we pulled out the Male from under Gender in the data set

//Trips by registered users (males)
    var tripsByReg = crossFilter.dimension(function(rows){ return rows.regulated});
    TripsGuysReg = tripsByReg.filter("Registered").top(Infinity);

    console.log("guys in 2012 that are reg:",TripsGuysReg.length);

//total number of trips in 2012, by all users (male, female, or unknown)
    var tripsByStation = crossFilter.dimension(function(rows){return rows.startStation});
        tripsByNEUStation = tripsByStation.filter("5").top(Infinity);

    console.log("Northeastern station Trips:", tripsByNEUStation.length);


//top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration.
    var tripsByDuration = crossFilter.dimension(function(rows){return rows.duration});
    tripsTop50 = tripsByDuration.top(50);

    console.log("top 50 trips from NEU station taken by guys that are reg:", tripsTop50);


//clear all filters
    tripsByYear.filter(null);//basically we have to specify this. because if we use crossFiler.remove like in API.. itll cancel everythig even to follow
    tripsByGender.filter(null);
    tripsByStation.filter(null);
    tripsByDuration.filter(null);


//grouping by 10-year age buckets:
    var tripsByAge = crossFilter.dimension(function(rows){return rows.userAge});
    tripsByAgeGroups = tripsByAge.group(function(rows){return Math.floor(rows/10)});
    
    //var grouping = tripsByAgeGroups.all();
    //console.log("Trips separated by age group by 10-year age buckets:", grouping);


}
function parse(d) {
    if (+d.duration < 0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        regulated: d.subsc_type,//must add this to use above
        sex: d.gender,//must add this to use above
        endStation: d.end_statn,
        userAge: d.birth_date?parseDate(d.start_date).getFullYear()-d.birth_date:0

        //age: parseAge(d.end_date, d.birth_date)
        //age: 2016-(+d.birth_date)

    }
}
function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

//function parseAge(date, birthdate){
//    var day = date.split(' ')[0].split('/');
//return (day[2] - birthdate)
//}
//
