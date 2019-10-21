
Project part: Part 1

Intro:	This is the first part of our VCS(Version Control System) project. In this project part, we implement 
	an initial repository with all the folders and files in the project. For each file, an Artifact ID is 
	created and the file is renamed with it in the repository folder inside the file folder with its name.
	A manifest file is created after the repository is created with the timestamp and the number of files
 	created in the repository folder.
	 
	
External Requirements:	1. NODE JS is required for the VCS project .
			
			

Build, Installation and Setup:	

			Refer the following to build and run the project:

1. Extract the zip folder
2. Open command prompt and change directory to project path
	 a. cd ../../543-p1-KARS/SEC
3. Install Express package- npm install express
			npm install express
			npm install fs-extra
			npm install mkdir@latest
			npm install dircompare
			
4. Execute the following commands: 
	 a. node app.js
5. Open browser and type localhost:3000
6. Create Repository- createrepo <testFolder> <RepoFolder> <ManifestFileLabel>
	Enter CreateRepo <space> Give the path where you have stored the project in the textbox.
	 (The path ending with project).For example- createrepo C:\Users\Documents\ASE\Project\543_p1_KARS\ C:\Users\Documents\ASE\Project\543_p1_KARS\VCS test123

7. Checkin Repository- checkin <testFolder> <RepoFolder>\ <ManifestFileLabel>
	Enter Checkin <space> Give the path where you have stored the project in the textbox.
	Note- Do not forget put extra slash \ after <RepoFolder>
	 (The path ending with project).For example- checkin C:\Users\Documents\ASE\Project\543_p1_KARS C:\Users\Documents\ASE\Project\543_p1_KARS\VCS test123
8. Checkout- checkout <Manifest File Path> <Empty Target Directory Path>
9. Mergein - mergein <src> <testFolder> <RepoFolder>\ <ManifestFileLabel>
	Enter Checkin <space> Give the path where you have stored the project in the textbox.
	Note- Do not forget put extra slash \ after <RepoFolder>
10.Mergeout- mergeout <src> <targetrepo>
	example- mergeout C:\Users\Documents\ASE\543_P2_KARS_new\GitRepo C:\Users\Documents\ASE\543_P2_KARS_new\GitRepoNewMerge

11. Listing- <folder Name>
 
Files List:
1.	app.js
2.	VCS_home.html
3.	assets
4.	public

Bugs : None detected
