/*Version Control System
CECS-543-KARS

Authors-Shraddha Nagargoje,Saumya Saumya
 */


const express = require('express');
var http = require('http');
const app = express()
const bodyparser= require('body-parser')
//const testFolder = 'C:/Users/saumy/SE/test';
var dircompare = require('dir-compare');
var format = require('util').format;
 
var options = {compareSize: true};
var testFolder = '';
var pathFinder='';
let results = [];
//const RepoFolder = 'C:/Users/saumy/SE/Repo/';
var RepoFolder = '';
var command = '';
const fs = require('fs');
const mkdirp = require('mkdirp');
const fsextra = require('fs-extra');
var path=require('path');
var srcFil = '';
var destFil = '';
var changeLog = '';
var finalFileMani = '';
var label = '';
app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyparser())


//Method Author-Saumya Date-04/20/2019
/*RepoCopy function (input-parameters- source repository,target snapshot,label)
Expected Behavior- Copy source to target repositories, generate manifest file
*/

function RepoCopy(src,dest,label){
 	fsextra.copy(src, dest, function (err) {
  if (err) return console.error(err)
	 
 //finalFileMani = dest+''+"Manifest_"+new Date().toLocaleTimeString().replace(" ","").replace(":","").replace(":","")+".txt";
  finalFileMani = dest+'/'+label+".txt";
  fsextra.outputFileSync(dest+'/'+label+".txt",
		'Manifest Created timestamp- '+new Date().toString()+"\r\n\n\n\n"+"Command Line: createrepo "+testFolder+" "+RepoFolder+"\r\n\n\n\nOriginal Folder: "+testFolder+"\r\n\n\n\nTarget Folder: "+RepoFolder+"\r\n\n\n\nFile Copied:- "+results,function(err){
				if (err) throw err; 
				}); 	  
  console.log('success! Far')
     filewalkerTarget(RepoFolder, function(err, data){
    if(err){
        throw err;
	  }
	});
  
   console.log("Change Log: "+changeLog);

 
});
}

function srcCopy(src,dest){
	fsextra.copy(src, dest, function (err) {
	if (err) return console.error(err)});
}



/*check-out function*/

function checkOut(manifest,targetFolder){
	var folder;
	console.log(manifest);
	//Reading Manifest Files
	fs.readFile(manifest, 'utf8', function(err, contents) {
		contents=contents.split("\r\n\n\n\n");
		
		contents.forEach(function(element){
		if(element.match("Original Folder: ")){
	
		folder=element.toString().substr(17,element.toString().length);
		
		console.log("Element"+folder);
		//Checking out into Target Folder
		fsextra.copy(folder, targetFolder, function (err) {
		console.log(err);
   
	}); 
	//Creating Manifest file
	fsextra.outputFile(targetFolder+"\\"+"checkout_Manifest.txt",
		'Manifest Created timestamp- '+new Date().toString()+"\r\n\n\n\n"+"Command Line: checkout "+folder+" Into "+targetFolder+"Manifest File-"+manifest,function(err){
				if (err) throw err; 
				}); 
	
	}
});
});
}


/*
function checkOut(manifest,targetFolder){
	var folder;
	console.log(manifest);
	//Reading Manifest Files
	fs.readFile(manifest, 'utf8', function(err, contents) {
		contents=contents.split("\r\n\n\n\n");
		
		contents.forEach(function(element){
		if(element.match("File Copied:- ")){
		console.log(element);
		folder=element.toString().substr(15,element.toString().length);
		folder=folder.split(",");
		console.log("Folder array is: "+folder);
	
		folder.forEach(function(fun){
			console.log("Each:"+fun +"into "+targetFolder);
			fsextra.copy(fun, targetFolder, function (err) {
		console.log(err);
   
	});
			
		});
		 
	//Creating Manifest file
	fsextra.outputFile(targetFolder+"\\"+"checkout_Manifest.txt",
		'Manifest Created timestamp- '+new Date().toString()+"\r\n\n\n\n"+"Command Line: checkout "+folder+" Into "+targetFolder+"Manifest File-"+manifest,function(err){
				if (err) throw err; 
				}); 
	
	}
});
});
}
*/
//Method Author-Shraddha Nagargoje Date-04/20/2019
/*Merge-Out function (input-parameters- source repository,target snapshot)
Expected Behavior- Compare source and target repositories, generate manifest file
*/

function mergeout(src,dest){
var states = {'equal' : '==', 'left' : '->', 'right' : '<-', 'distinct' : '<>'};
 
// Synchronous recursive comparison of source repository,target snapshot
var res = dircompare.compareSync(src, dest, options);
res.diffSet.forEach(function (entry) {
    var state = states[entry.state];
	
    var name1 = entry.name1 ? entry.name1 : '';//file from source
    var name2 = entry.name2 ? entry.name2 : '';//file from destination
	console.log(state);
   //mismatch from target snapshot
	if( state.match('<-') ){
		
		console.log("New files in Target repository "+entry.name2+"in"+entry.path2);
		if(typeof entry.path1=='undefined' && entry.type2=='file'){
			var fname=entry.name2.substr(0,entry.name2.lastIndexOf('.'));//filename from target
			var ext=entry.name2.substr(entry.name2.lastIndexOf('.'),entry.name2.length);//fileExtension from target
			
			fs.rename( entry.path2+"/"+entry.name2,entry.path2+"/"+fname+'_MT'+ext, function (err) {
	if (err) return console.error(err)});
		}}
		//mismatch from source repository
	else if(state.match('->')){
		
		console.log("Mismatch from source repository "+entry.name1+"in"+entry.path1);
		if(typeof entry.path2=='undefined' && entry.type1=='file'){
		
			var fname=entry.name1.substr(0,entry.name1.lastIndexOf('.'))+"_MR";
			var ext=entry.name1.substr(entry.name1.lastIndexOf('.'),entry.name1.length);
			console.log(fname+ext);
			fsextra.copy(entry.path1+"\\"+entry.name1,dest+"\\"+entry.relativePath+"\\"+fname+ext, function (err) {
	if (err) return console.error(err)});}
	}
	//When filenames are same in source and destination but artifactId is different
	else {
		
		if(state.match('<>')){
			var fname1=entry.name1.substr(0,entry.name1.lastIndexOf('.'))+"_MR";
			var ext1=entry.name1.substr(entry.name1.lastIndexOf('.'),entry.name1.length);
			fsextra.copy(entry.path1+"\\"+entry.name1,dest+"\\"+entry.relativePath+"\\"+fname1+ext1, function (err) {
	if (err) return console.error(err)});
		var fname2=entry.name2.substr(0,entry.name2.lastIndexOf('.'))+"_MT";
			var ext2=entry.name2.substr(entry.name2.lastIndexOf('.'),entry.name2.length);
			fsextra.copy(entry.path2+"\\"+entry.name2,dest+"\\"+entry.relativePath+"\\"+fname2+ext2, function (err) {
	if (err) return console.error(err)});
	}
	}
});


//Creating merge-out Manifest File
fsextra.outputFile(dest+"\\"+"Merge-Out_Manifest.txt",
		'Manifest Created timestamp- '+new Date().toString()+"\r\n\n\n\n"+"Command Line: merge-out "+src+" and "+dest,function(err){
				if (err) throw err; 
				}); 
}


//Method Author-Saumya Date-04/05/2019
/*RepoCopy function (input-parameters- source repository,target snapshot)
Expected Behavior- Copy source to target repositories, generate manifest file
*/
function RepoCopy_Checkin(src,dest){ 
 finalFileMani = dest+'/'+label+".txt";
 
  fsextra.outputFileSync(dest+'/'+label+".txt",
		'Manifest Created timestamp- '+new Date().toString()+"\r\n\n\n\n"+"Command Line: checkin "+testFolder+" "+RepoFolder+"\r\n\n\n\nOriginal Folder: "+testFolder+"\r\n\n\n\nTarget Folder: "+RepoFolder+"\r\n\n\n\nFile Copied:- "+results,function(err){
				if (err) throw err; 
				}); 	  
  console.log('success! Far')
       filewalkerTarget_checkin(testFolder+"\\", function(err, data){ //use this if checkin
    if(err){
        throw err;
	  }
	});
  
   console.log("Change Log: "+changeLog);


   console.log("finalFileMani: "+finalFileMani);
 
//});
}

//Method author-Shraddha Nagargoje Date- 02/15/2019
//Generate checksum using file content method
function generateChecksum(file){
	var content=fs.readFileSync(file,'utf8');//reading file content
	var fileversion=0;
	var hash;
	for(i=0;i<content.length;i++){
		switch(i%4){
			case 0:
				fileversion= fileversion + parseInt(content.charCodeAt(i)*1);
				break;
			case 1:
					fileversion= fileversion + parseInt(content.charCodeAt(i)*7);
				break;
			case 2:
					fileversion= fileversion + parseInt(content.charCodeAt(i)*3);
				break;
			case 3:
					fileversion= fileversion +  parseInt(content.charCodeAt(i)*7);
				break;
			case 4:
					fileversion= fileversion +  parseInt(content.charCodeAt(i)*11);
				break;
			default:
					break;
		}	
	}
	hash=parseInt(fileversion)+"-L"+content.length;
	
return hash;
	//createFolder(targetFileName,dir,file,pathFinder);	
                
}

function createFolder(targetFileName,dir,file,pathFinder){

var pathStr ='test';

var str1 = ""+pathFinder;
var str = str1.split(",");

filePath= RepoFolder; 
console.log("pathFinder: "+pathFinder);

mkdirp(filePath, function(err) { 

});
	fsextra.outputFile(filePath+'/'+targetFileName,
		'Manifest Created timestamp- '+new Date().toString()+"\r\n\n\n\n"+"File Path:- "+file,function(err){
				if (err) throw err; 
				});
}

//Anchor Shraddha Nagargoje
//reading source folder recursively
function filewalker(dir, done) {
    results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
		console.log("LIST:::: "+list);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file){
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat){
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                    //results.push(file);
                    pathFinder = results; 
                    filewalker(file, function(err, res){
                        //results = results.concat(res);
						console.log("res"+res);
                                             
					console.log("Result Path "+results);
                        if (!--pending) done(null, results);
                    });
                } else {
				
				     console.log("*******FILE*******"+file);
					     
                    hash=generateChecksum(file);      
                    results.push(file+" "+hash+" "+new Date().toString());
					if (!fs.existsSync(file)){
                    fs.mkdirSync(file);   
					}
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};



//Method Author-Saumya Date-04/20/2019
/*RepoCopy function (input-parameters- source repository,target snapshot)
Expected Behavior- Compares source and target repositories, generate Content for manifest file
*/
function filewalkerTarget(dir, done) {
    results = [];
	console.log("filewalkertarget"+dir);
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
		console.log("LIST:::: "+list);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file){
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat){
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                    //results.push(file);
                    pathFinder = results; 
                    filewalkerTarget(file, function(err, res){
                        //results = results.concat(res);
						console.log("res"+res);
                                             
					console.log("Result Path "+results);
                        if (!--pending) done(null, results);
                    });
                } else {

                   if(!file.includes(label)){
					   
				     console.log("*******FILE*******"+file);
					 var t = file;
                     t1 = t.substr(0, t.lastIndexOf("\\"));
					 t2 = t.substr(t.lastIndexOf("\\")+1,t.length);
					 console.log("*******This is path*******"+t1);
                     console.log("*******Create this folder*******"+t2);
					
					    console.log("*******FILE*******"+file);
						hash=generateChecksum(file);
					//console.log(file+hash);
					//call hashcode function for the content of file and return hashcode: hashcode
                  //fs.renameSync(file, t1+"/"+hashcode+"+t2, function(err) {
 				if(!fs.existsSync(file+"\\"+hash)){
				fs.renameSync(file, t1+"/"+hash, function(err) {
                     if ( err ) console.log('ERROR: ' + err);
                     });       
					
                          if (!fs.existsSync(file)){
                               fs.mkdirSync(file);
                             }
				if(!file.includes(hash)){
					fs.renameSync(t1+"\\"+hash, file+"\\"+hash, function(err) {
                     if ( err ) console.log('ERROR: ' + err);
                     });
				    } 
				}       
                    results.push(","+file+"\\"+hash);// logic for artifact id goes here
                    changeLog = changeLog+" "+file+"\\"+hash+",";   
					
					fs.appendFileSync(finalFileMani, changeLog.toString(), function (err) {
  if (err) throw err;
  console.log('Saved!: '+finalFileMani);
});
   console.log("finalFileMani: "+finalFileMani);

                    if (!--pending) done(null, results);
					
				  }
                }
            });
        });
    });
};



//Method Author-Saumya Date-04/05/2019
/*RepoCopy function (input-parameters- source repository,target snapshot)
Expected Behavior- Compares source and target repositories, generate Content for manifest file for checkin
*/
//Targetrepository checkin

function filewalkerTarget_checkin(dir, done) {
    results = [];
	console.log("filewalkertarget"+dir);
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
		console.log("LIST:::: "+list);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file){
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat){
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                    //results.push(file);
                    pathFinder = results; 
                    filewalkerTarget_checkin(file, function(err, res){
                        //results = results.concat(res);
						console.log("res"+res);
                                             
					console.log("Result Path "+results);
                        if (!--pending) done(null, results);
                    });
                } else {

                   if(!file.includes(label)){
					   
				     console.log("*******FILE*******"+file);
					 var t = file;
                     t1 = t.substr(0, t.lastIndexOf("\\"));
					 t2 = t.substr(t.lastIndexOf("\\")+1,t.length);
					 console.log("*******This is path*******"+t1);
                     console.log("*******Create this folder*******"+t2);
					
					    console.log("*******FILE*******"+file);
						hash=generateChecksum(file);
					
				
				var tempFolD = t2.replace('.txt','');
				fs.copyFileSync(file, RepoFolder+tempFolD+"/"+t2+"/"+hash, function(err) {
                     if ( err ) console.log('ERROR: ' + err);
                     });       
					
					var changeFol = file.replace(srcFil,destFil);
                          if (!fs.existsSync(changeFol)){
                               fs.mkdirSync(changeFol);
                             }
				if(!changeFol.includes(hash)){
					fs.copyFileSync(t1+"\\"+t2, changeFol+"\\"+hash, function(err) {
                     if ( err ) console.log('ERROR: ' + err);
                     });
				    
					} 
			//	}   
                    changeLog = changeLog+""+changeFol+"\\"+hash+" ";	
                    console.log('change Log Frirt: '+changeLog);
fs.appendFileSync(finalFileMani, changeLog.toString(), function (err) {
  if (err) throw err;
  console.log('Saved!: '+finalFileMani);
});					
                    results.push(changeFol+"\\"+hash+",");// logic for artifact id goes here

                    if (!--pending) done(null, results);
					
				  }
                }
            });
        });
    });
};

//Method Author-Saumya and Shraddha Date-04/20/2019
/* Main method */

app.get('/', function (req, res) {
	
  console.log('Welcome to VCS Home');

	res.sendfile('VCS_home.html');
});
app.post('/myaction', function(req, res) {
  console.log('You sent the name "' + req.body.command + '".');
  str = req.body.command;
  var res = str.split(" ");
  command = res[0];
  testFolder = res[1];
  RepoFolder = res[2];
  
  
 
 var testLast = testFolder.split("/");
 var repoLast = RepoFolder.split("/");
 
  		testLast.forEach(function(element){
   if(element.toString() != ''){ 
	srcFil = element.toString();
   }
});
  		repoLast.forEach(function(element){
	if(element.toString() != ''){
      destFil = element.toString();
	}
});
console.log("Source folder PD: "+srcFil);
console.log("Dest folder PD: "+destFil);
  
  
  console.log('You sent the name "' + req.body.command + '".');
//Create Repository call
if(command.match("createrepo")){
	 testFolder = res[1];
  RepoFolder = res[2];
  label=res[3];
	
	RepoCopy(testFolder, RepoFolder,label);
}
// checkout
else if(command.match("checkout")){
	 manifest = res[1];
	targetFolder=res[2];
	console.log("targetFolder"+targetFolder);
	checkOut(manifest,targetFolder, function(err, data){
    if(err){
        throw err;
	  }
	});
	
}
else if(command.match("checkin") || command.match("mergein")){
	testFolder = res[1];
  RepoFolder = res[2];
  label=res[3];
		RepoCopy_Checkin(testFolder, RepoFolder,label);
}
else if(command.match("mergeout")){
	testFolder = res[1];
  RepoFolder = res[2];
  
		mergeout(testFolder, RepoFolder);
}
else{
	fs.readdir(res[0], function(err, items) {
    console.log(items);
 
    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
    }
	
});
}


});

app.post('/', function (req, res) {

});


app.listen(3000, function () {
	
	console.log('Example app listening on port 3000!')
})

	