const fs = require('fs/promises');


class Commands {
    command = "";
    
    constructor(){}

    execute(){
        console.log("Command does not exists");
    }
}

class CreateFile extends Commands{
    constructor(path = ""){
        super();
        this.command = CreateFile.type();
        this.filePath = path.substring(this.command.length + 1).trim();
    }
    async execute(){
        try {
            const newFileHandle = await fs.open(this.filePath,'w');
            newFileHandle.close();
            
            return console.log(`The file ${path} already exists`);
            
        } catch (error) {
            console.log(`Got error creating a file ${error.message}`);
        }
    }
    static type(){
        return 'create a file';
    }
}

class DeleteFile extends Commands{
    constructor(path = ""){
        super();
        this.command = DeleteFile.type();
        this.filePath = path.substring(this.command.length + 1).trim();
    }
   
    async execute(){
        console.log('Deleting file')
        try {
            await fs.unlink(this.filePath);
        } catch (error) {
            console.log(`The file does not exist ${error.message}`);
        }
    }
    static type(){
        return 'delete a file';
    }

}
// add to file <path> this content <content>
class AddToFile extends Commands{
    constructor(path = ""){
        super();
        this._idx = path.indexOf(" this content ");
        this.command = AddToFile.type();
        this.filePath = path.substring(this.command.length+1, this._idx).trim();
        this.content = path.substring(this._idx + 14);
        this.addedContent = null;
        
    }
    async execute(){
        if(this.addedContent === this.content){

            return ;
        }
        console.log("Adding to file")

        try {
            await fs.appendFile(this.filePath,this.content);
        } catch (error) {
            this.log.error(`Error writting to the file`);
        }
        this.addedContent = this.content;
    }
    static type(){
        return "add to file";
    }
}


class RenameFile extends Commands{
    constructor(path = ""){
        super();
        this.command = RenameFile.type();
        this.indexOfTo = path.indexOf(" to ");
        this.oldeFilePath = path.substring(this.command.length + 1,this.indexOfTo).trim();
        this.newFilePath = path.substring(this.indexOfTo+4).trim();
    }
    async execute(){
        try {
            const existingFileHanlde = await fs.open(this.oldeFilePath,'r');
            existingFileHanlde.close();
            await fs.rename(this.oldeFilePath,this.newFilePath);
        } catch (error) {
            console.log(`The file ${this.oldeFilePath} does not exist`);
        }
    }

    static type(){
        return "rename the file";
    }
}

class CommandFactory{
    static create(path){
        if(path.includes(CreateFile.type())){
            return new CreateFile(path);
        }
        if(path.includes(RenameFile.type())){
            return new RenameFile(path);
        }
        if(path.includes(DeleteFile.type())){
            return new DeleteFile(path);
        }
        if(path.includes(AddToFile.type())){
            return new AddToFile(path);
        }
        return new Commands();
    }
   
}
class ReadFileHandler{
    /**
     * 
     * @param {import('fs/promises').FileHandle} fileHandler 
     */
    static async read(fileHandler){
        const size = (await fileHandler.stat()).size;
        const buffer = Buffer.alloc(size);
        const offset = 0;
        const length = buffer.byteLength;
        const position = 0;
        const content = await fileHandler.read(buffer,offset,length,position);
        return content
    }
}

(async ()=> {
    const commandFileHandler =  await fs.open("./command.txt","r");
    commandFileHandler.on("change", async ()=>{
        const fh = await fs.open('./command.txt',"r");
        const content =   await ReadFileHandler.read(fh);
        await fh.close();
        const input = content.buffer.toString("utf-8");
        const command= CommandFactory.create(input);
        command.execute();
    })
    const watcher = fs.watch("./command.txt");
    for await(const event of watcher){
        commandFileHandler.emit("change");
    }
})();