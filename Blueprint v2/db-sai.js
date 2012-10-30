//start DB

var index = 0;
var db = prepareDatabase();

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
                    t.executeSql( createSQL, [], function(t, r) {}, function(t, e) {
                        alert('create table: ' + e.message);
                    });
                });
                return db;
            }
        }

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
		
		function getTaskFromLocalStorage(id, callbackTask) {
			
            db.readTransaction(function(t) {
                t.executeSql('SELECT * FROM tasks WHERE id = ?', [id], function(t, r) {
                    callbackTask(r.rows.item(0));
                });
            });
        }
        
    	function deleteTaskFromLocalStorage(id) {
    	
                db.transaction(function(t) {
                    t.executeSql('DELETE FROM tasks WHERE id = ?', [id]);
                });
        }
        
        var TaskDB = {};
        
        TaskDB.addTask =  addTaskToLocalStorage;
        TaskDB.getTask =  getTaskFromLocalStorage;
        TaskDB.deleteTask = deleteTaskFromLocalStorage;
        
        
//end DB