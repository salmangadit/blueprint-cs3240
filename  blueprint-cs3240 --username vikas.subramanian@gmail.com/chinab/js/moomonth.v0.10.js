/*
Title: MooMonth
  <MooMonth.Base>

Script: MooMonth.js
  MooMonth - Full javascript calendar with MooTools.

License:
  CC-GNU LGPL, <http://creativecommons.org/licenses/LGPL/2.1/>

MooMonth Copyright:
  copyright (c) 2007 Roland Poulter, <http://rolandpoulter.com>

MooMonth Credits:
  - All this wouldn't be possible without MooTools <http://mootools.net>, (c) 2007 Valerio Proietti, MIT-style license
*/

var MooMonth = {
  version: "0.10"
};

/*
Constant: $DaysPerWeek
  <MooMonth.Constants.DaysPerWeek>
*/

/*
Namespace: MooMonth.Constants
*/

MooMonth.Constants = {
  
  /*
  Property: DaysPerWeek
    Weeks always have 7 days
  */
  
  DaysPerWeek: 7
};
$DaysPerWeek = MooMonth.Constants.DaysPerWeek;

/*
Namespace: MooMonth.Module
*/

MooMonth.Module = {
  
  /*
  Property: Coorinates
    <MooMonth.Module.Coordinates>
  */
  
  Coordinates: {},
  
  /*
  Property: Selectors
    <MooMonth.Module.Selectors>
  */
  
  Selectors: {},
  
  /*
  Property: Transitions
    <MooMonth.Module.Transitions>
  */
  
  Transitions: {}
};

/*
Namespace: MooMonth.Module.Coordinates
  Alias: $mmC
*/

MooMonth.Module.Coordinates = {
  
  /*
  Function: from
    Get the day, and week position from a <MooMonth.Element> day element, or UID.
  
  Arguments:
    el *OR* number - Either a <MooMonth.Element> day element, or a UID.
  
  Returns:
    array - An array with the day, and week position.
  */
  
  from: function(el) {
    var type = $type(el), d, w;
    if(type === "string") uid = el.split("-").getLast();
    else if(type === "element") uid = el.id.split("-").getLast();
    else uid = el;
    d = uid % $DaysPerWeek;
    w = (uid - d) / $DaysPerWeek;
    return [d, w];
  },
  
  /*
  Function: toId
    Find the UID of a day based on it's position.
  
  Arguments:
    number - Day position, number.
    number - Week position, number.
  
  Returns:
    number - UID of the <MooMonth.Element> day element.
  */
  
  toId: function(d, w) {
    return (w.toInt() * $DaysPerWeek) + d.toInt();
  }
};
$mmC = MooMonth.Module.Coordinates;

/*
Namespace: MooMonth.Module.Selectors
  Alias: $mmS
*/

MooMonth.Module.Selectors = {
  
  /*
  Function: from
    Find an element from a <MooMonth.Element>.
  
  Arguments:
    string - Selector prefix.
    number *OR* array - A UID. *OR* Day poisition. (/w week argument) *OR* Array with the day and week positions.
    number - Optional, Week poisition.
  
  Returns:
    el - A calendar element.
  */
  
  from: function(prefix, uid) {
    if(!$defined(uid)) return false;
    if($type(uid) === "array") {
      return $(prefix + "-" + $mmC.toId.pass(uid));
    } else if(arguments.length > 2) {
      return $(prefix + "-" + $mmC.toId(uid, arguments[2]));
    } else {
      return $(prefix + "-" + uid);
    }
  },
  
  /*
  Function: fromId
    Same as <from> but assumes UID is just a number.
  */
  
  fromId: function(prefix, uid) {
    return $(prefix + "-" + uid);
  },
  
  /*
  Function: toId
    Find the UID of a <MooMonth.Element> element.
  
  Arguments:
    el - <MooMonth.Element> element.
  
  Returns:
    number - UID of the element.
  
  Note:
    The UID from content in a MooMonth.Element is different then the UID from a wrapper element.
  */
  
  toId: function(el) {
    return $(el).id.split("-").getLast().toInt();
  }
};
$mmS = MooMonth.Module.Selectors;

/*
Namespace: MooMonth.Module.Transitions
  Alias: $mmT
*/

MooMonth.Module.Transitions = {
  
  /*
  Function: forEach
    
  
  Arguments:
    array - A list of (MooTools: Fx.Elements) effects.
    object - Styles to be passed into each effect as the transition.
  */
  
  forEach: function(effects, styles) {
    effects.each(function(effect, index) {
      var elements = {};
      if($chk(styles[index].height)) $extend(styles[index], {lineHeight: styles[index].height});
      for(var i = 0; i < effect.elements.length; i++) elements[i] = styles[index];
      effect.start(elements);
    });
  }
};
$mmT = MooMonth.Module.Transitions;



/*
Class: MooMonth.DateObject
  A "Utility" Class which adds a set property for seting dates.
*/

MooMonth.DateObject = new Class({
  
  /*
  Property: set
    Sets the date value, and calls this.update.
  
  Arguments:
    timestamp - New date.
  */
  
  set: function(date) {
    this.date = new Date(date);
    if(this.update) this.update();
  }
});

/*
Class: MooMonth.Day

Arguments:
  timestamp - This date.
  week - <MooMonth.Week> object.
*/

MooMonth.Day = new Class({
  initialize: function(date, week) {
    this.week = week;
    this.set(date);
    this.events = [];
  },
  update: function() {
    this.day = this.date.getDate();
    this.weekDay = this.date.getDay();
    this.name = this.date.getDayName();
  },
  addEvent: function(event) {
    this.events.push(event);
  }
});
MooMonth.Day.implement(new MooMonth.DateObject);

/*
Class: MooMonth.Week

Arguments:
  timestamp - This date.
  month - <MooMonth.Month> object.
*/

MooMonth.Week = new Class({
  initialize: function(date, month) {
    this.month = month;
    this.set(date);
  },
  
  update: function() {
    var date = this.date.getDate(),
        week = this.date.getWeek(),
        month = this.month.month,
        year = this.month.year.year;
    if(month === 11 && week === 0) week = 52;
    if(month === 0 && week === 0) {week = 0; year -= 1;}
    this.week = week;
    this.name = this.week + 1;
    this.monthWeek = this.week - this.month.date.getMonthWeek();
    this.days = [];
    for(var i = 0; i < $DaysPerWeek; i++) {
      this.days[i] = new MooMonth.Day(new Date(year, this.date.getMonth(), date + i), this);
    }
  }
});
MooMonth.Week.implement(new MooMonth.DateObject);

/*
Class: MooMonth.Month

Arguments:
  timestamp - This date.
  month - <MooMonth.Year> object.
*/

MooMonth.Month = MooMonth.DateObject.extend({
  initialize: function(date, year) {
    this.year = year;
    this.set(date);
  },
  update: function() {
    var firstDay = this.date.getMonthDay(),
        endDay = this.date.getMonthEnd(),
        firstWeek = this.date.getMonthWeek(),
        fullMonth = firstDay - 1 + endDay,
        weeksLength = Math.ceil(fullMonth / $DaysPerWeek);
    this.month = this.date.getMonth();
    this.name = this.date.getMonthName();
    this.offset = firstDay - 1;
    this.weeks = [];
    for(var i = 0; i < weeksLength; i++) {
      var temp = temp = this.date.copy();
      this.weeks[i] = new MooMonth.Week(temp.setWeek(firstWeek + i), this);
    }
  }
});
MooMonth.Month.implement(new MooMonth.DateObject);

/*
Class: MooMonth.Year

Arguments:
  timestamp - This date.
*/

MooMonth.Year = new Class({
  initialize: function(date) {
    this.set(date);
  },
  update: function() {
    this.year = this.date.getFullYear();
    this.offset = this.date.getYearStartDay();
    this.isLeap = this.date.isLeapYear();
  }
});
MooMonth.Year.implement(new MooMonth.DateObject);

/*
Class: MooMonth.Date

Arguments:
  timestamp - This date.
  moomonth - Optional, <MooMonth.Base> object.
*/

MooMonth.Date = new Class({
  //(*date, *root)
  initialize: function(date, root) {
    this.date = new Date(date || $today);
    if(root) this.root = root;
    this.update();
  },
  set: function(date) {
    this.date = new Date(date);
    this.update();
    if(this.root && this.root.fireEvent) this.root.fireEvent("onDateSet");
  },
  update: function() {
    this.year = new MooMonth.Year(this.date);
    this.month = new MooMonth.Month(this.date, this.year);
    this.week = new MooMonth.Week(this.date, this.month);
    this.day = new MooMonth.Day(this.date, this.week);
  }
});


/*
Class: MooMonth.Session
*/

MooMonth.Session = new Class({
  
});
MooMonth.Session.implement(new Options);


/*
Class: MooMonth.Events
*/

MooMonth.Events = new Class({
  initialize: function(options) {
    this.fetch();
  },
  fetch: function() {
    this.events = [];
  },
  create: function() {
    var event = new MooMonth.Event(arguments);
    event.save();
  }
});

/*
Class: MooMonth.Event
*/

MooMonth.Event = new Class({
  options: {
    
  },
  initialize: function(options) {
    this.setOptions(options);
  },
  save: function() {
    alert(this);
  },
  udpate: function() {
    alert(this);
  },
  destroy: function() {
    alert(this);
  }
});
MooMonth.Event.implement(new Options);


/*
Class: MooMonth.Size

Arguments:
  moomonth - <MooMonth.Base> object.
  array *OR* width *OR* el - _All Optional_, Array with the width, and height. *OR* Element width. (/w height argument) *OR* An element to copy.
  height - Optional, Element height.
*/

MooMonth.Size = new Class({
  //(*root, *([w, h] || w, h) || *wrapper)
  initialize: function(root) {
    var width, height, type = $type(root);
    if(type === "array" || arguments.length > 2) {
      this.type = "solid";
      width = arguments[1][0] || arguments[1];
      height = arguments[1][1] || arguments[2];
    }
    else if(type === "element" || type === "string") {
      this.type = "wrapper";
      this.wrapper = $(arguments[1]);;
      width = this.wrapper.offsetWidth;
      height = this.wrapper.offsetHeight;
    }
    else {
      this.type = "liquid";
      width = window.getWidth();
      height = window.getHeight();
    }
    this.root = root;
    this.setChecker();
    this.update(width, height);
  },
  removeChecker: function() {
    if(this.type === "wrapper") {
      $clear(this.checker);
    } else if(this.type === "liquid") {
      window.onresize = null;
    }
  },
  setChecker: function() {
    if($defined(this.checker)) this.removeChecker();
    if(this.type === "wrapper") {
      this.checker = function() {
        if(this.isPaused) return false;
        var newWidth = this.wrapper.offsetWidth.toInt(), newHeight = this.wrapper.offsetHeight.toInt();
        if(newWidth !== this.width || newHeight !== this.height) this.set(newWidth, newHeight);
      }.periodical(500, this);
    } else if(this.type === "liquid") {
      window.onresize = function() {
        if(this.isPaused) return false;
        this.set(window.getWidth(), window.getHeight());
      }.bind(this);
    }
  },
  set: function(w, h) {
    this.update(w, h);
    if(this.root && this.root.fireEvent) this.root.fireEvent("onSizeSet");
  },
  update: function(w, h) {
    this.width = w;
    this.height = h;
  },
  pause: function() {
    this.isPaused = true;
  },
  resume: function() {
    this.isPaused = false;
  }
});

/*
Class: MooMonth.Resize

Arguments:
  moomonth - <MooMonth.Base> object.
  options - Effect options.
*/

MooMonth.Resize = Fx.Base.extend({
  initialize: function(root, options) {
    this.root = root;
    this.parent(options);
  },
  setNow: function() {
    this.now = this.compute(this.from, this.to);
  },
  compute: function(from, to) {
    return [this.parent(from[0], to[0]), this.parent(from[1], to[1])];
  },
  start: function(from, to) {
    if (!this.options.wait) this.stop();
    else if (this.timer) return this;
    this.root.size.pause();
    this.from = from;
    this.to = to;
    this.change = [this.to[0] - this.from[0], this.to[0] - this.from[0]];
    this.time = $time();
    this.timer = this.step.periodical(Math.round(1000 / this.options.fps), this);
    this.fireEvent('onStart', this.element);
    return this;
  },
  stop: function(end){
    if (!this.timer) return this;
    this.timer = $clear(this.timer);
    this.root.size.resume();
    if (!end) this.fireEvent('onCancel', this.element);
    return this;
  },
  fromTo: function(w, h) {
    this.root.size.removeChecker();
    this.root.size.type = "solid";
    return this.start([this.root.size.width, this.root.size.height], [w, h]);
  },
  toFull: function() {
    var to;
    if($defined(this.root.wrapper)) {
      this.root.size.type = "wrapper";
      to = [this.root.size.wrapper.offsetWidth, this.root.size.wrapper.offsetHeight];
    } else {
      this.root.size.type = "liquid";
      to = [window.getWidth(), window.getHeight()];
    }
    this.root.size.setChecker();
    return this.start([this.root.size.width, this.root.size.height], to);
  },
  increase: function() {
    this.root.size.set(this.now[0], this.now[1]);
  }
});


/*
Class: MooMonth.Element

Arguments:
  moomonth - <MooMonth.Base> object.
  el - Optional, element to be used as the parenNode.
*/

MooMonth.Element = new Class({
  initialize: function(root, element) {
    this.root = root;
    this.uid = this.root.uid;
    this.element = element || this.root.element;
    this.options = this.root.options;
    this.date = this.root.date;
    this.size = this.root.size;
    
    this.element.addClass = this.root.type;
    this.wrapper = new Element("div", {
      "id": "calendar-wrapper-" + this.uid,
      "class": "calendar-wrapper"
    }).injectInside(this.element);
    
    this.header = new Element("div", {
      "id": "calendar-header-" + this.uid,
      "class": "calendar-header",
      "style": {"height": this.options.headerHeight + "px"}
    }).injectInside(this.wrapper);
    this.monthLabel = new Element("h1", {
      "id": "calendar-main-label-" + this.uid,
      "class": "calendar-month-label"
    }).injectInside(this.header);
    
    this.main = new Element("div", {
      "id": "calendar-main-" + this.uid,
      "class": "calendar-main"}
    ).injectAfter(this.header);
    
    this.weeks = new Element("div", {
      "id": "calendar-weeks-" + this.uid,
      "class": "calendar-weeks",
      "styles": {"width": this.options.labelSize}
    }).injectInside(this.main);
    this.weeksLabel = new Element("div", {
      "id": "calendar-weeks-labels-" + this.uid,
      "class": "calendar-weeks-label",
      "styles": {"width": this.options.labelSize, "height": this.options.labelSize}
    }).injectInside(this.weeks);
    this.weeksContainer = new Element("div", {
      "id": "calendar-weeks-contianer-" + this.uid,
      "class": "calendar-weeks-container",
      "styles": {"width": this.options.labelSize}
    }).injectAfter(this.weeksLabel);
    
    this.days = new Element("div", {
      "id": "calendar-days-" + this.uid,
      "class": "calendar-days"
    }).injectAfter(this.weeks);
    this.dayLabels = new Element("div", {
      "id": "calendar-day-labels-" + this.uid,
      "class": "calendar-day-labels",
      "styles": {"height": this.options.labelSize}
    }).injectInside(this.days);
    this.daysContainer = new Element("div", {
      "id": "calendar-days-container-" + this.uid,
      "class": "calendar-days-container"
    }).injectAfter(this.dayLabels);
    this.paintMonth();
  },
  paintMonth: function() {
    var opacity = this.main.effect("opacity", {duration: 500, transition: Fx.Transitions.Quad.easeInOut});
    var action = function() {
      var daysHtml = "", weeksHtml = "", labelsHtml = "",
          monthTypes = ["last-month", "this-month", "next-month"],
          year = this.date.year,
          month = this.date.month,
          weeks = this.date.month.weeks;
      if(!this.monthPainted) {
        for(var i = 0; i < $DaysPerWeek; i++) {
          labelsHtml += "<div id=\"day-label-" + i + "\" class=\"day d-" + i + "\">" + Date.dayNames[i] + "</div>";
        }
        this.weeksLabel.innerHTML = "wk";
        this.dayLabels.innerHTML = labelsHtml;
        this.monthPainted = true;
      }
      this.monthLabel.innerHTML = "" +
        "<span class=\"labels\">" +
          "<a href=\"#\" id=\"month-view-" + this.uid + "\" >" + month.name + "</a> " +
          "<a href=\"#\" id=\"year-view-" + this.uid + "\" >" + year.year + "</a>" +
        "</span>"+
        " " +
        "<span class=\"controls\">" +
          "<a href=\"#\" id=\"previous-" + this.uid + "\">&lt;</a> " +
          "<a href=\"#\" id=\"current-" + this.uid + "\">&bull;</a> " +
          "<a href=\"#\" id=\"next-" + this.uid + "\">&gt;</a>" +
        "</span>";
      if(this.root.type === "app") {
        $mmS.fromId("month-view", this.uid).onclick = this.resetMonthSize.bindAsEventListener(this);
        $mmS.fromId("year-view", this.uid).onclick = this.toYearView.bindAsEventListener(this);
      } 
      $mmS.fromId("previous", this.uid).onclick = this.root.previousMonth.bindAsEventListener(this.root);
      $mmS.fromId("current", this.uid).onclick = this.root.currentMonth.bindAsEventListener(this.root);
      $mmS.fromId("next", this.uid).onclick = this.root.nextMonth.bindAsEventListener(this.root);
      for(var i = 0; i < weeks.length; i++) {
        var week = weeks[i], days = week.days;
        weeksHtml += "<div id=\"week-label-" + week.monthWeek + "\" class=\"week w-" + week.monthWeek + "\">" + week.name + "</div>";
        daysHtml += "<div id=\"week-" + week.monthWeek + "\" class=\"week w-" + week.monthWeek + "\">";
        for(var j = 0; j < days.length; j += 1) {
          var day = days[j], classes = "day d-" + day.weekDay + " " + monthTypes[1 + day.date.getMonth() - month.month];
          daysHtml += ""+
          "<div id=\"day-" + $mmC.toId( day.weekDay, week.monthWeek ) + "\" class=\"" + classes + "\">" +
            "<div class=\"inner-day\">"+
              "<div class=\"day-label\"><a id=\"day-close-" + $mmC.toId( day.weekDay, week.monthWeek ) + "\" class=\"close\">X</a>" + day.day + "</div>" +
              "<div class=\"day-content\">"+
                "<p>See it will work with text that wraps.</p>" +
              "</div>"+
            "</div>" +
          "</div>";
        }
        daysHtml += "</div>";
      }
      this.weeksContainer.innerHTML = weeksHtml;
      this.daysContainer.innerHTML = daysHtml;
      this.view = "month";
      this.resizeMonth();
    }.delay(500, this);
    opacity.start(1, 0).chain(function() {this.start(0, 1);});
  },
  
  resizeMonth: function() {
    var margin = this.options.margin, border = this.options.border.toInt(),
        wrapperWidth = this.size.width - margin[0], wrapperHeight = this.size.height - margin[1],
        mainWidth = wrapperWidth, mainHeight = wrapperHeight - this.options.headerHeight,
        tempWidth = mainWidth - border - this.options.labelSize, tempHeight = mainHeight - border - this.options.labelSize;
    this.containerWidth = tempWidth - (tempWidth % $DaysPerWeek);
    this.containerHeight = tempHeight - (tempHeight % this.date.month.weeks.length);
    this.dayWidth = Math.floor(this.containerWidth / $DaysPerWeek);
    this.weekHeight = Math.floor(this.containerHeight  / this.date.month.weeks.length);
    // Set elements dimensions
    this.wrapper.setStyles({"width": wrapperWidth, "height": wrapperHeight});
    this.header.setStyle("width", wrapperWidth);
    this.main.setStyles({"width": mainWidth, "height": mainHeight});
    this.weeksContainer.setStyle("height", this.containerHeight);
    this.days.setStyles({"width": this.containerWidth, "height": mainHeight});
    this.dayLabels.setStyle("width", this.containerWidth);
    this.daysContainer.setStyles({"width": this.containerWidth, "height": this.containerHeight});
    this.resizeDays();
    this.resizeWeeks();
  },
  resizeDays: function() {
    var labels = $$("#" + this.dayLabels.id + " .day"),
        days = $$("#" + this.daysContainer.id + " .day"),
        dayWidth = this.dayWidth,
        dayHeight = this.weekHeight,
        border = this.options.border.toInt();
    labels.each(function(label, index) {
      label.style.width = dayWidth - border + "px";
      label.style.height = this.options.labelSize - border + "px";
      label.style.left = index * dayWidth + "px";
    }.bind(this));
    days.each(function(day, index) {
      var position = $mmC.from(day);
      day.onclick = function(e, day) {
        if(this.root && this.root.fireEvent) this.root.fireEvent("onDayClick", [day]);
        e.stopPropagation();
      }.bindAsEventListener(this, [day]);
      day.style.width = dayWidth - border + "px";
      day.style.left = (position[0] * dayWidth) + "px";
    }.bind(this));
  },
  resizeWeeks: function() {
    var weeks = $$("#" + this.weeksContainer.id + " .week"),
        days = $$("#" + this.daysContainer.id + " .week"),
        dayHeight = this.weekHeight,
        border = this.options.border;
    weeks.each(function(week, index) {
      week.onclick = function(e, week) {
        if(this.root && this.root.fireEvent) this.root.fireEvent("onWeekClick", [week]);
        e.stopPropagation();
      }.bindAsEventListener(this, [week]);
      week.style.width = this.options.labelSize - border + "px";
      week.style.height = dayHeight - border + "px";
      week.style.lineHeight = dayHeight + "px";
      week.style.top = index * dayHeight + "px";
    }.bind(this));
    days.each(function(day, index) {
      day.style.height = dayHeight - border + "px";
      day.style.top = index * dayHeight + "px";
    }.bind(this));
  },
  
  toYearView: function() {
    if(this.view === "year") {this.toMonthView(); return false;}
    else this.view = "year";
    var newWidth = Math.floor(this.size.width / 4),
        newHeight = Math.floor(this.size.height / 3);
    if($defined(this.root.resize)) {
      this.wrapper.addClass = "mini";
      this.root.resize.fromTo(newWidth, newHeight);
      var move = new Fx.Styles(this.wrapper, {duration: 500});
      move.start({"left": (window.getWidth() - newWidth) / 2, "top": (window.getHeight() - newHeight) / 2});
      //this.root.newMiniMooMonth(new Date(2008, 4, 20), newWidth, newHeight);
    } else {
      //this.size.set(newWidth, newHeight);
    }
    var afterResize = function() {
      this.wrapper.onclick = function(e) {
        e.stopPropagation();
        this.toMonthView();
      }.bindAsEventListener(this);
    };
    afterResize.delay(500, this);
  },
  toMonthView: function() {
    if(this.view !== "year") {return false;}
    else this.view = "month";
    if($defined(this.root.resize)) {
      this.wrapper.removeClass = "mini";
      this.root.resize.toFull();
      var move = new Fx.Styles(this.wrapper, {duration: 500});
      move.start({"left": 0, "top": 0});
    } else {
      //this.size.set(newWidth, newHeight);
    }
    this.wrapper.onclick = null;
  },
  // CHANGE el TO week, OR USE A this.selected
  toWeekView: function(el) {
    this.resetExpandedWeek();
    this.expandedWeek = el;
    this.zoomWeek(el);
  },
  // CHANGE el TO day, OR USE A this.selected
  toDayView: function(el) {
    this.resetExpandedDay();
    this.expandedDay = el;
    if(this.view === "day" || this.view === "week") this.fullDay(el);
    else this.zoomDay(el);
  },
  
  onDayClick: function(el) {
    var delay = 0;
    if(this.view === "year") {this.toMonthView(); delay = 600;}
    if(this.expandedDay !== el) {
      this.toDayView.delay(delay, this, [el]);
    } else {
      if(this.view !== "day") this.fullDay.delay(delay, this, [el]);
    }
  },
  onWeekClick: function(el) {
    var delay = 0;
    if(this.view === "year") {this.toMonthView(); var delay = 600;}
    if(this.expandedWeek !== el) {
      this.toWeekView.delay(delay, this, [el]);
    } else {
      this.resetMonthSize();
    }
  },
  
  resetExpandedDay: function() {
    if(!$defined(this.expandedDay)) return false;
    var el = this.expandedDay,
        dayDW = $mmC.from(el),
        day = this.date.month.weeks[ dayDW[1] ].days[ dayDW[0] ],
        close = $("day-close-" + $mmS.toId(el.id));
    el.removeClass("expanded");
    close.style.display = "none";
    this.expandedDay = null;
  },
  resetExpandedWeek: function() {
    if(!$defined(this.expandedWeek)) return false;
    this.expandedWeek = null;
  },
  resetMonthSize: function() {
    if(this.view === "year") {this.toMonthView(); return false;}
    else if(this.view === "month") return false;
    if(this.expandedDay) this.resetExpandedDay();
    else if(this.expandedWeek) this.resetExpandedWeek();
    this.view = "month";
    var rows = this.date.month.weeks.length, border = this.options.border.toInt(),
        effectsOptions = {duration: 500, transition: Fx.Transitions.Sine.easeOut},
        weeks = [], weeksEffects = [],
        days = [], daysEffects = [];
    for(var i = 0; i < this.date.month.weeks.length; i++) {
      weeksEffects[i] = new Fx.Elements($$("#" + this.wrapper.id + " .w-" + i), effectsOptions);
      weeks[i] = {"height": this.weekHeight - border, "top": this.weekHeight * i};
    }
    for(var i = 0; i < $DaysPerWeek; i++ ) {
      daysEffects[i] = new Fx.Elements($$("#" + this.wrapper.id + " .d-" + i), effectsOptions);
      days[i] = {"width": this.dayWidth - border, "left": this.dayWidth * i};
    }
    $mmT.forEach(weeksEffects, weeks);
    $mmT.forEach(daysEffects, days);
  },
  
  zoomDay: function(el) {
    if(this.expandedWeek) this.resetExpandedWeek();
    this.view = "zoom";
    var dayDW = $mmC.from(el),
        day = this.date.month.weeks[ dayDW[1] ].days[ dayDW[0] ],
        dayClasses = el.className,
        dayClose = $("day-close-" + $mmS.toId(el.id)),
        rows = this.date.month.weeks.length,
        cols = $DaysPerWeek,
        border = this.options.border.toInt(),
        widthNormal = this.dayWidth,
        widthSmall = Math.floor(widthNormal * (cols - 2) / (cols - 1)),
        widthLarge = Math.floor(widthNormal * 2),
        heightNormal = this.weekHeight,
        heightSmall = Math.floor(heightNormal * (rows - 2) / (rows - 1)),
        heightLarge = Math.floor(heightNormal * 2),
        weeks = [], weeksEffects = [],
        days = [], daysEffects = [],
        effectsOptions = {duration: 500, transition: Fx.Transitions.Sine.easeOut};
    el.addClass("expanded");
    dayClose.style.display = "block";
    dayClose.onclick = function(e) {
      this.resetMonthSize();
      e.stopPropagation();
    }.bindAsEventListener(this);
    for(var i = 0; i < rows; i++ ) {;
      weeksEffects[i] = new Fx.Elements($$("#" + this.wrapper.id + " .w-" + i), effectsOptions);
      if(i < day.week.monthWeek) weeks[i] = {"height": heightSmall - border, "top": heightSmall * i};
      else if (i > day.week.monthWeek) weeks[i] = {"height": heightSmall - border, "top": heightLarge + heightSmall * (i - 1)};
      else weeks[i] = {"height": heightLarge - border, "top": heightSmall * i};
    }
    for(var i = 0; i < cols; i++ ) {
      daysEffects[i] = new Fx.Elements($$("#" + this.wrapper.id + " .d-" + i), effectsOptions);
      if(i < day.weekDay) days[i] = {"width": widthSmall - border, "left": widthSmall * i};
      else if (i > day.weekDay) days[i] = {"width": widthSmall - border, "left": widthLarge + widthSmall * (i - 1)};
      else days[i] = {"width": widthLarge - border, "left": widthSmall * i};
    }
    $mmT.forEach(weeksEffects, weeks);
    $mmT.forEach(daysEffects, days);
  },
  zoomWeek: function(el) {
    if(this.expandedDay) this.resetExpandedDay();
    this.view = "week";
    var week = $mmS.toId(el),
        rows = this.date.month.weeks.length,
        cols = $DaysPerWeek,
        border = this.options.border.toInt(),
        widthNormal = this.dayWidth,
        heightNormal = this.weekHeight,
        heightSmall = 20,
        heightLarge = this.daysContainer.style.height.toInt() - (heightSmall * (rows - 1)),
        days = [],
        weeks = [],
        tempWeeks = [],
        effectsOptions = {duration: 500, transition: Fx.Transitions.Sine.easeOut},
        daysEffects = [];
        weeksEffects = [];
    for(var i = 0; i < rows; i++ ) {;
      weeksEffects[i] = new Fx.Elements($$("#" + this.wrapper.id + " .w-" + i), effectsOptions);
      if(i < week) weeks[i] = {"height": heightSmall - border, "top": heightSmall * i};
      else if (i > week) weeks[i] = {"height": heightSmall- border, "top": heightLarge + heightSmall * (i - 1)};
      else weeks[i] = {"height": heightLarge - border, "top": heightSmall * i};
    }
    for(var i = 0; i < cols; i++ ) {
      daysEffects[i] = new Fx.Elements($$("#" + this.wrapper.id + " .d-" + i), effectsOptions);
      days[i] = {"width": widthNormal - border, "left": widthNormal * i};
    }
    $mmT.forEach(weeksEffects, weeks);
    $mmT.forEach(daysEffects, days);
  },
  
  fullDay: function(el) {
    if(this.expandedWeek) this.resetExpandedWeek();
    this.view = "day";
    var dayDW = $mmC.from(el),
        day = this.date.month.weeks[ dayDW[1] ].days[ dayDW[0] ],
        dayClasses = el.className,
        dayClose = $("day-close-" + $mmS.toId(el.id)),
        rows = this.date.month.weeks.length,
        cols = $DaysPerWeek,
        border = this.options.border.toInt(),
        widthNormal = this.dayWidth,
        widthSmall = 20,
        widthLarge = this.daysContainer.style.width.toInt() - (widthSmall * (cols - 1)),
        heightNormal = this.weekHeight,
        heightSmall = 20,
        heightLarge = this.daysContainer.style.height.toInt() - (heightSmall * (rows - 1)),
        weeks = [], weeksEffects = [],
        days = [], daysEffects = [],
        effectsOptions = {duration: 500, transition: Fx.Transitions.Sine.easeOut};
    el.addClass("expanded");
    dayClose.style.display = "block";
    dayClose.onclick = function(e) {
      this.resetMonthSize();
      e.stopPropagation();
    }.bindAsEventListener(this);
    for(var i = 0; i < rows; i++ ) {;
      weeksEffects[i] = new Fx.Elements($$("#" + this.wrapper.id + " .w-" + i), effectsOptions);
      if(i < day.week.monthWeek) weeks[i] = {"height": heightSmall - border, "top": heightSmall * i};
      else if (i > day.week.monthWeek) weeks[i] = {"height": heightSmall - border, "top": heightLarge + heightSmall * (i - 1)};
      else weeks[i] = {"height": heightLarge - border, "top": heightSmall * i};
    }
    for(var i = 0; i < cols; i++ ) {
      daysEffects[i] = new Fx.Elements($$("#" + this.wrapper.id + " .d-" + i), effectsOptions);
      if(i < day.weekDay) days[i] = {"width": widthSmall - border, "left": widthSmall * i};
      else if (i > day.weekDay) days[i] = {"width": widthSmall - border, "left": widthLarge + widthSmall * (i - 1)};
      else days[i] = {"width": widthLarge - border, "left": widthSmall * i};
    }
    $mmT.forEach(weeksEffects, weeks);
    $mmT.forEach(daysEffects, days);
  }
});

/*
Section: MooMonths (Array)
  All initialized MooMonths get added to an array called MooMonths.
*/

var MooMonths = [];

/*
Section: MooMonth.DefaultOptions
  Object with the default MooMonth options.
*/

MooMonth.DefaultOptions = {
  margin: [24, 16],
  border: 1,
  headerHeight: 45,
  labelSize: 20
};

/*
Class: MooMonth.Base
*/

MooMonth.Base = new Class({
  options: MooMonth.DefaultOptions,
  //(el, date, *options)
  initialize: function(el, date, options) {
    this.type = $pick(this.type, "base");
    this.uid = MooMonths.length;
    MooMonths.push(this);
    if(options) this.setOptions(options);
    this.date = new MooMonth.Date($pick(date, ""), this);
    this.today = $today;
    this.element = $(el);
    this.element.className = "calendar " + this.type;
  },
  currentMonth: function() {
    this.date.set(this.today);
  },
  nextMonth: function() {
    this.date.set(this.date.date.getNextMonth());
  },
  previousMonth: function() {
    this.date.set(this.date.date.getLastMonth());
  }
});
MooMonth.Base.implement(new Options, new Events);

/*
Class: MooMonth.App
*/

MooMonth.App = MooMonth.Base.extend({
  options: {
    calendar: MooMonth.DefaultOptions,
    app: {}
  },
  initialize: function() {
    this.type = "app";
    this.parent.apply(this, arguments);
    this.session = new MooMonth.Session();
    this.size = new MooMonth.Size(this);
    this.resize = new MooMonth.Resize(this);
    this.calendar = new MooMonth.Element(this);
    this.miniMooMonths = [];
    this.addEvent("onDateSet", this.onDateSet.bind(this));
    this.addEvent("onSizeSet", this.calendar.resizeMonth.bind(this.calendar));
    this.addEvent("onDayClick", this.calendar.onDayClick.bind(this.calendar));
    this.addEvent("onWeekClick", this.calendar.onWeekClick.bind(this.calendar));
  },
  onDateSet: function() {
    this.calendar.paintMonth();
  },
  newMiniMooMonth: function(date, width, height) {
    var index = this.miniMooMonths.length;
        id = "calendar-" + this.uid + "-" + index;
    this.element.adopt(new Element("div", {id: id}));
    this.miniMooMonths.push(new MooMonth.Mini($(id), date, width, height, this.options.calendar));
    return this.miniMooMonths[index];
  }
});

/*
Class: MooMonth.Mini
*/

MooMonth.Mini = MooMonth.Base.extend({
  options: MooMonth.DefaultOptions,
  initialize: function(el, date, width, height, options) {
    this.type = "mini";
    this.parent.apply(this, [el, date, options]);
    this.session = new MooMonth.Session();
    this.size = new MooMonth.Size(this, width, height);
    this.resize = new MooMonth.Resize(this);
    this.calendar = new MooMonth.Element(this);
    this.addEvent("onDateSet", this.onDateSet.bind(this));
    this.addEvent("onSizeSet", this.calendar.resizeMonth.bind(this.calendar));
    this.addEvent("onDayClick", this.calendar.onDayClick.bind(this.calendar));
    this.addEvent("onWeekClick", this.calendar.onWeekClick.bind(this.calendar));
  },
  onDateSet: function() {
    this.calendar.paintMonth();
  }
});

/*
Class: MooMonth.DatePicker
*/

MooMonth.DatePicker = MooMonth.Base.extend({});