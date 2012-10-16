/*
Title: MooDate

Script: MooDate.js
  MooDate - Date extention needed for MooMonth.

License:
  CC-GNU LGPL, <http://creativecommons.org/licenses/LGPL/2.1/>

MooDate Copyright:
  copyright (c) 2007 Roland Poulter, <http://rolandpoulter.com>
*/

var MooDate = {
  version: "0.10"
};

/* Section: Function */

/*
Function: Function.checkValue
  Throws an error if value is not defined.

Arguments:
  value - value to be checked.
  kind - value name.
*/

Function.checkValue = function(value, kind) {
  if(!$defined(value)) throw(new Error("No " + kind + " arguement"));
};

/*
Function: Function.checkType
  Throws an error if value is not the right type.

Arguments:
  value - Value to be checked.
  type - Type to check for.
  kind - Value"s name.
*/

Function.checkType = function(value, type, kind) {
  if($type(value) != type) throw(new Error(kind.capitalize() + " argument must be a " + type + "."));
};

/*
Function: Function.checkBoolean
  Shortcut to using <Function.checkType> with a boolean for type. With a "boolean" kind.

Arguments:
  bool - Boolean to be checked.
*/

Function.checkBoolean = function(bool) {
  try {
    Function.checkValue(bool, "boolean"); Function.checkType(bool, "boolean", "boolean");
  } catch(err) {if($defined(console)) console.error(this, "Error:" + err.message);}
};

$native(Date);

/* Section: Date */

/*
Function: Date.now
  Same as new Date()

Returns:
  New date with the current time.
*/

Date.now = function() {return new Date();};

/*
Function: $today
  Same as <Date.now>
*/

$today = function() {return Date.now();}();

/*
Function: Date.checkYear
  Shortcut to using <Function.checkType> with a number for type.  With a "year" kind.

Arguments:
  year - Value to be checked
*/

Date.checkYear = function(year) {
  try {
    Function.checkValue(year, "year"); Function.checkType(year, "number", "year");
  } catch(err) {if(console) console.error(this, "Error:" + err.message);}
};

/*
Function: Date.checkDate
  Shortcut to using <Function.checkType> with a number for type. With a "date" kind.

Arguments:
  date - Value to be checked
*/

Date.checkDate = function(date) {
  try {
    Function.checkValue(date, "date"); Function.checkType(date, "number", "date");
  } catch(err) {if(console) console.error(this, "Error:" + err.message);}
};

/*
Property: Date.dayNames
  An array with each of the day names in order starting at Sunday.
*/

Date.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/*
Property: Date.dayAbbreviations
  An array with each of the day abbreviations in order starting at Sunday.
*/

Date.dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/*
Property: Date.monthNames
  An array with each of the months names in order starting at January.
*/

Date.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/*
Property: Date.monthAbbreviations
  An array with each of the months abbreviations in order starting at January.
*/

Date.monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


/*
Property: Date.defaultLengths
  An array with each of the month lengths in order starting with January.
*/

Date.defaultLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/*
Property: Date.defaultAggregateLengths
  An array with each of the month lengths added together from the first month to the current in the array. Starts with January.
*/

Date.defaultAggregateLengths = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

/*
Function: Date.getLengths
  Same as <Date.defaultLengths> but modifies for a leap you if _isLeapYear is true.

Arguments:
  boolean - Set to true if leap year.

Returns:
  array - <Date.defaultAggregateLengths> with modifications.
*/

Date.getLengths = function(_isLeapYear) {
  Function.checkBoolean(_isLeapYear);
  var returns = Date.defaultLengths.copy();
  if(_isLeapYear) returns[1] = 29;
  return returns;
};

/*
Function: Date.getAggregateLengths
  Same as <Date.defaultAggregateLengths> but modifies for a leap you if _isLeapYear is true.

Arguments:
  boolean - Set to true if leap year.

Returns:
  array - <Date.defaultAggregateLengths> with modifications.
*/

Date.getAggregateLengths = function(_isLeapYear) {
  Function.checkBoolean(_isLeapYear);
  var returns = Date.defaultAggregateLengths.copy();
  if(_isLeapYear) returns = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
  return returns;
};

/*
Function: Date.isLeapYear
  Checks if passed in year is a leap year.

Arguments:
  number - Year to be checked.

Returns:
  boolean - True if year is leap year, else false.
*/

Date.isLeapYear = function(year) {
  Date.checkYear(year);
  var is_leap = year % 4, is_century = year % 1000;
  return (is_leap === 0 && is_century !== 0) ? true : false;
};

/*
Function: Date.yearLength
  Returns the year length, 366 if a leap year, else 365

Arguments:
  boolean - Set to true if leap year.

Returns:
  number - Year length.
*/

Date.yearLength = function(_isLeapYear) {
  Function.checkBoolean(_isLeapYear);
  return _isLeapYear ? 366 : 365;
};

/*
Function: Date.yearStartDay
  Get the year"s week offset.

Arguments:
  number - Year.

Returns:
  number - Year"s week offset.
*/

Date.yearStartDay = function(year) {
  Date.checkYear(year);
  return new Date(year, 0, 1).getDay();
};

/*
Function: Date.yearDateToMonthDate
  Convert a year date to a month date.

Arguments:
  number - The day number starting from the begining of the year.
  boolean - Is a leap year.

Returns:
  array - Month, and the day of the month.
*/

Date.yearDateToMonthDate = function(yearDate, _isLeapYear) {
  Date.checkDate(yearDate); Function.checkBoolean(_isLeapYear);
  var returnMonth = 11, returnDate = 1;
  if(0 > yearDate) {
    returnMonth = 11;
    returnDate += Date.getLengths(_isLeapYear)[ 11 ] + yearDate;
  }
  else if(365 < yearDate) {
    returnMonth = 0;
    returnDate += yearDate - Date.yearLength(_isLeapYear);
  }
  else {
    var lengths = Date.getLengths(_isLeapYear);
    for(var i = 0; i < 11; i++) {
      if(yearDate <= lengths[i]) {returnMonth = i; break;}
      else yearDate -= lengths[i];
    }
    returnDate += yearDate;
  }
  return [returnMonth, returnDate]; // [0] = Month, [1] = Date;
};

/* Section: Date.prototype Extention */

Date.extend({
  
  /*
  Property: copy
    Created a copy of the current date.
  
  Returns:
    date - A copy of the original date.
  */
  
  copy: function() {
    return new Date(this);
  },
  
  /*
  Property: to
    Set the time to.
  
  Arguments:
    timestamp - Timestamp to be set to.
  */
  
  to: function(time) {
    if($type(time) == "object") time = time.getTime();
    this.setTime(time);
  },
  
  /*
  Property: toNow
    Same as <to>, but sets to the current time.
  */
  
  toNow: function() {
    this.setTime(Date.now().getTime());
    return this;
  },
  
  /*
  Property: toYesterday
    Same as <to>, but sets to the current time yesterday.
  */
  
  toYesterday: function() {
    this.setTime(this.getYesterday());
    return this;
  },
  
  /*
  Property: toTomorrow
    Same as <to>, but sets the the current time tomorrow.
  */
  
  toTomorrow: function() {
    this.setTime(this.getTomorrow());
    return this;
  },
  
  /*
  Property: toThisWeek
    Same as <to>, but sets the the current time this week.
  */
  
  toThisWeek: function() {
    
  },
  
  /*
  Property: toLastWeek
    Same as <to>, but sets the the current time last week.
  */
  
  toLastWeek: function() {
    this.setTime(this.getLastWeek());
    return this;
  },
  
  /*
  Property: toNextWeek
    Same as <to>, but sets the the current time next week.
  */
  
  toNextWeek: function() {
    this.setTime(this.getNextWeek());
    return this;
  },
  
  /*
  Property: toThisMonth
    Same as <to>, but sets the the current time this month.
  */
  
  toThisMonth: function() {
    
  },
  
  /*
  Property: toLastMonth
    Same as <to>, but sets the the current time last month.
  */
  
  toLastMonth: function() {
    this.setTime(this.getLastMonth());
    return this;
  },
  
  /*
  Property: toNextMonth
    Same as <to>, but sets the the current time next month.
  */
  
  toNextMonth: function() {
    this.setTime(this.getNextMonth());
    return this;
  },
  
  /*
  Property: toThisYear
    Same as <to>, but sets the the current time this year.
  */
  
  toThisYear: function() {
    
  },
  
  /*
  Property: toThisYear
    Same as <to>, but sets the the current time last year.
  */
  
  toLastYear: function() {
    this.setTime(this.getLastYear());
    return this;
  },
  
  /*
  Property: toThisYear
    Same as <to>, but sets the the current time next year.
  */
  
  toNextYear: function() {
    this.setTime(this.getNextYear());
    return this;
  },
  
  /*
  Property: getDayName
    Gets the name of the current day.
  
  Returns:
    string - The name of the day.
  */
  
  getDayName: function() {
    return Date.dayNames[this.getDay()];
  },
  
  /*
  Property: getDayAbbreviation
    Gets the abbreviation of the current day.
  
  Returns:
    string - The abbreviation of the day.
  */
  
  getDayAbbreviation: function() {
    return Date.dayAbbreviations[this.getDay()];
  },
  
  /*
  Property: getMonthName
    Gets the name of the current month.
  
  Returns:
    string - The name of the month.
  */
  
  getMonthName: function() {
    return Date.monthNames[this.getMonth()];
  },
  
  /*
  Property: getMonthAbbreviation
    Gets the abbreviation of the current month.
  
  Returns:
    string - The abbreviation of the month.
  */
  
  getMonthAbbreviation: function() {
    return Date.monthAbbreviations[this.getMonth()];
  },
  
  /*
  Property: getYearDate
    Gets the date from the begining of the year.
  
  Returns:
    number - The year date, between 0 and 366.
  */
  
  getYearDate: function() {
    return Date.getAggregateLengths(this.isLeapYear())[this.getMonth()] + this.getDate() - 1;
  },
  
  /*
  Property: getYearStartDay
    Gets the day for the first day of the year.
  
  Returns:
    number - The year start day, between 0 and 6.
  */
  
  getYearStartDay: function() {
    return Date.yearStartDay(this.getFullYear());
  },
  
  /*
  Property: getYearLength
    Gets length of the current year.
  
  Returns:
    number - The year length, either 365 or 366.
  */
  
  getYearLength: function() {
    return Date.yearLength(this.isLeapYear());
  },
  
  /*
  Property: getYesterday
    Gets the date for yesterday.
  
  Returns:
    number - Yesterday.
  */
  
  getYesterday: function() {
    return this.copy().setDate(this.getDate() - 1);
  },
  
  /*
  Property: getTomorrow
    Gets the date for tomorrow.
  
  Returns:
    number - Tomorrow.
  */
  
  getTomorrow: function() {
    return this.copy().setDate(this.getDate() + 1);
  },
  
  /*
  Property: getWeek
    Gets the week of the year.
  
  Returns:
    number - Week, between 0 and 52.
  */
  
  getWeek: function() {
    result = Math.floor((this.getYearDate() + this.getYearStartDay()) / 7);
    return (result < 52) ? result : 0;
  },
  
  /*
  Property: getWeekDate
    Gets a timestap for the begining of this week.
  
  Returns:
    timestamp - Time at the begining of this week.
  */
  
  getWeekDate: function() {
    return this.copy().setYearDate(this.getYearDate() - this.getDay());
  },
  
  /*
  Property: getWeekYearDate
    Gets the year date for the begining of this week.
  
  Returns:
    number - Year date at the begining of this week, between 0 and 366.
  */
  
  getWeekYearDate: function()
  {
    return this.copy().setWeek(this.getWeek()).getYearDate();
  },
  
  /*
  Property: getLastYear
    Gets the date for last week.
  
  Returns:
    number - Last week.
  */
  
  getLastWeek: function() {
    return this.copy().setWeek(this.getWeek() - 1);
  },
  
  /*
  Property: getNextWeek
    Gets the date for next week.
  
  Returns:
    number - Next week.
  */
  
  getNextWeek: function() {
    return this.copy().setWeek(this.getWeek() + 1);
  },
  
  /*
  Property: getMonthDate
    Gets a timestamp for begining of this month.
  
  Returns:
    timestamp - Time at the begining of this month.
  */
  
  getMonthDate: function() {
    return this.copy().setDate(1);
  },
  
  /*
  Property: getMonthYearDate
    Gets the year date at the begining of this month.
  
  Returns:
    number - Year date at the begining of this month.
  */
  
  getMonthYearDate: function() {
    var temp = new Date(this.getMonthDate());
    return temp.getYearDate();
  },
  
  /*
  Property: getMonthWeek
    Gets the first week of this month.
  
  Returns:
    number - Week.
  */
  
  getMonthWeek: function() {
    var temp = new Date(this.getMonthDate());
    return temp.getWeek();
  },
  
  /*
  Property: getMonthDay
    Gets the day offset for the begining of this month.
  
  Returns:
    number - First day of the month, between 0 and 6.
  */
  
  getMonthDay: function() {
    var temp = new Date(this.getMonthDate());
    return temp.getDay();
  },
  
  /*
  Property: getMonthEnd
    Gets the length of this month.
  
  Returns:
    number - Month length.
  */
  
  getMonthEnd: function() {
    var month = this.getMonth();
    if(month !== 1) return Date.defaultLengths[month];
    else return Date.getLengths(this.isLeapYear())[month];
  },
  
  /*
  Property: getLastMonthEnd
    Gets the length of the last month.
  
  Returns:
    number - Month length.
  */
  
  getLastMonthEnd: function() {
    var tempDate = this.copy(this.getLastMonth());
    return tempDate.getMonthEnd();
  },
  
  /*
  Property: getLastMonth
    Gets the timestamp for last month.
  
  Returns:
    timestamp - Last month.
  */
  
  getLastMonth: function() {
    /*var year = this.getFullYear(), month = this.getMonth();
        if(month == 0) {year -= 1; month = 11;}
        else month -= 1;
        return this.copy().setFullYear(year, month);*/
    return this.copy().setMonth(this.getMonth() - 1);
  },
  
  /*
  Property: getNextMonth
    Gets the timestamp for next month.
  
  Returns:
    timestamp - Last month.
  */
  
  getNextMonth: function() {
    return this.copy().setMonth(this.getMonth() + 1);
  },
  
  /*
  Property: getLastYear
    Gets the date for last year.
  
  Returns:
    number - Last year.
  */
  
  getLastYear: function() {
    return this.copy().setFullYear(this.getFullYear() - 1);
  },
  
  /*
  Property: getNextYear
    Gets the date for next year.
  
  Returns:
    number - Next year.
  */
  
  getNextYear: function() {
    return this.copy().setFullYear(this.getFullYear() + 1);
  },
  
  
  /*
  Property: setYearDate
    Sets the month and date to a year date.
  
  Arguments:
    year - Optional, year.
    yearDate - Number between 0, and 366
  
  Returns:
    timestamp - New time.
  */
  
  setYearDate: function(yearDate) {
    var newDate;
    if($defined(arguments[1])) {
      if($type(arguments[0]) == "number") this.setYear(arguments[0]);
      newDate = Date.yearDateToMonthDate(arguments[1], this.isLeapYear());
    } 
    else newDate = Date.yearDateToMonthDate(yearDate, this.isLeapYear());
    return this.setMonth(newDate[0], newDate[1]);
  },
  
  /*
  Property: setWeek
    Sets the month and date to this week.
  
  Arguments:
    week - Number between 0, and 52
  
  Returns:
    timestamp - New time.
  
  Note:
    If the week is 52 it may go to week 0 depending on the current month.
  */
  
  setWeek: function(week, day) {
    if(week > 52) return false;
    var year = this.getFullYear(), month = this.getMonth(), yearDate, newDate;
    if(week == 52 && month == 0) week = 0;
    yearDate = week * 7;
    if($defined(day)) yearDate += day;
    newDate = Date.yearDateToMonthDate(yearDate, this.isLeapYear());
    return this.setMonth(newDate[0], newDate[1] - this.getYearStartDay());
  },
  
  /*
  Property: isLeapYear
    Checks if this year is a leap year.
  
  Returns:
    boolean - true if this year is a leap year, else false.
  */
  
  isLeapYear: function() {
    return Date.isLeapYear(this.getFullYear());
  },
  
  /*
  Property: isBefore
    Check if a date object is before another date object
    
  Arguments:
    date - Date to compare.
    
  Returns:
    boolean - True if before.
  */
  
  isBefore: function(date) {
    if(!$defined(date)) return false;
    return (this.getTime() < date.getTime());
  },
  
  /*
  Property: isAfter
    Check if a date object is after another date object
  
  Arguments:
    date - Date to compare.
  
  Returns:
    boolean - True if before.
  */
  
  isAfter: function(date) {
    if(!$defined(date)) return false;
    return (this.getTime() > date.getTime());
  },
  
  /*
  Property: equalTo
    Check if an other date and time is the equal to this.
  
  Arguments:
    date - Date to compare.
  
  Returns:
    boolean - True if equal.
  */
  
  equalTo: function(date) {
    if(!$defined(date)) return false;
    return (this.getTime() === date.getTime());
  },
  
  /*
  Property: equalDate
    Check if an other date is the same as this.
  
  Arguments:
    date - Date to compare.
  
  Returns:
    boolean - True if equal.
  */
  
  equalDate: function(date) {
    if(!$defined(date)) return false;
    return (this.copy().getTime() === date.clearTime());
  },
  
  /*
  Property: increment
    Add an amount of time to a date. Negative numbers can be passed to subtract time.
  
  Arguments:
    string - Increment interval.
    number - Amount.
  
  Returns:
    date - This.
  */
  
  increment: function(interval, value) {
    if(!interval && !number) return this;
    switch(interval) {
    case "year": this.setFullYear(this.getFullYear() + value); break;
    case "month": this.setMonth(this.getMonth() + value); break;
    case "week": this.setWeek(this.getWeek() + value); break;
    case "day": this.setDate(this.getDate() + value); break;
    case "hour": this.setHours(this.getHours() + value); break;
    case "minute": this.setMinutes(this.getMinutes() + value); break;
    case "hour": this.setSeconds(this.getSeconds() + value); break;
    default: this.setYearDate(this.getYearDate() + value); break;
    }
    return this;
  },
  
  /*
  Property: decrement
    Same as <increment> but decreases by the interval.
  */
  
  decrement: function(interval, value) {
    return this.increment(interval, -value);
  },
  
  /*
  Property: clearTime
    Clears hours, minutes, and seconds.
  
  Returns:
    timestamp - New date, without a time.
  */
  
  clearTime: function() {
    return this.setHours(0, 0, 0, 0);
  }
});