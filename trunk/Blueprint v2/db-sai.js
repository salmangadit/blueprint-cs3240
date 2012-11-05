//start DB

/** Local storage API for Blueprint
  * @author saiaspire
 */


var index = 0;

// db is our database object
var db = prepareDatabase();

		// sql string to create database
        var createSQL = 'CREATE TABLE IF NOT EXISTS tasks (' +
                'id INTEGER PRIMARY KEY,' +
                'description TEXT,' +
                'start DATETIME,' +
                'end DATETIME,' +
                'priority INT' +
            ')';

        // Check if this browser supports Web SQL
        function getOpenDatabase() {
            try {
                if( !! window.openDatabase ) return window.openDatabase;
                else return undefined;
            } catch(e) {
                return undefined;
            }
        }

        // Open the Web SQL database
        function prepareDatabase() {
            var odb = getOpenDatabase();
            if(!odb) {
                dispError('Web SQL Not Supported');
                return undefined;
            } else {
                var db = odb( 'blueprint', '1.0', 'Task Database', 10 * 1024 * 1024 );
                db.transaction(function (t) {
                    t.executeSql( createSQL, [], function(t, r) {
                    	setIndex();
                    }, function(t, e) {
                        alert('create table: ' + e.message);
                    });
                });
                return db;
            }
        }
        
        // set index based on last row in DB
        function setIndex() {
            db.readTransaction(function(t) {
                t.executeSql('SELECT * FROM tasks ORDER BY id ASC', [], function(t, r) {
					if(r.rows.length > 0)
					{
						index = r.rows.item(r.rows.length - 1).id;
                    }
                    console.log("DB Index is " + index);
                });
            });
        }
		
		// to add task to local storage
		// @param taskData is an object with following expected parameters 
		//        priority[high,medium,low], description[text], start and end[date]
		function addTaskToLocalStorage(taskData) {
			
			var priority;
			++index;
				
			if(taskData.priority === "high")
			{
				priority = 0;
			}
			else if(taskData.priority === "medium")
			{
				priority = 1;
			}
			else if(taskData.priority === "low")
			{
				priority = 2;
			}	
			
			db.transaction( function(t) {
                    t.executeSql(' INSERT INTO tasks ( id, description, start, end, priority ) VALUES ( ?, ?, ?, ?, ? ) ',
                        [ index, taskData.description, taskData.start, taskData.end, priority ]
                    );
                }, function(t, e){ alert('Insert row: ' + e.message); }, function() {
                    //call back on success
                });
            
            return index;                             
		
		}
		
		// gets task with specific id
		// @param id of task
		// @param callbackTask, Callback function that 
		// gets the row with id as parameter
		function getTaskFromLocalStorage(id, callbackTask) {
			
            db.readTransaction(function(t) {
                t.executeSql('SELECT * FROM tasks WHERE id = ?', [id], function(t, r) {
                    callbackTask(r.rows.item(0));
                });
            });
        }
        
        // gets all tasks from DB with highest priority first
        // @param callbackTask, Callback function that
        // gets the rows as parameter
        function getAllTasks(callbackTask) {
			
            db.readTransaction(function(t) {
                t.executeSql('SELECT * FROM tasks ORDER BY id ASC', [], function(t, r) {
                    callbackTask(r.rows);
                });
            });
        }
        
        // deletes task with specific id
        // @param id to delete
    	function deleteTaskFromLocalStorage(id) {
    	
                db.transaction(function(t) {
                    t.executeSql('DELETE FROM tasks WHERE id = ?', [id]);
                });
        }
        
        // updates task object
        // @param task object with updated data
        function updateTaskInLocalStorage(task){
        	
        	var priority;
        	
        	if(task.priority === "high")
			{
				priority = 0;
			}
			else if(task.priority === "medium")
			{
				priority = 1;
			}
			else if(task.priority === "low")
			{
				priority = 2;
			}	

        
        db.transaction( function(t) {
                    t.executeSql(' UPDATE tasks SET description = ?, start = ?, end = ?, priority = ? WHERE id = ?',
                        [ task.description, task.start, task.end, priority, task.id ]
                    );
                }, function(t, e){ alert('Update row: ' + e.message); }, function() {
                    
                });
        }
        
        // TaskDB is the global object that you can use 
        // and has the methods as below
        var TaskDB = {};
        
        TaskDB.addTask =  addTaskToLocalStorage;
        TaskDB.getTask =  getTaskFromLocalStorage;
        TaskDB.deleteTask = deleteTaskFromLocalStorage;
        TaskDB.updateTask = updateTaskInLocalStorage;
        TaskDB.getAllTasks = getAllTasks;
        
        
//end DB