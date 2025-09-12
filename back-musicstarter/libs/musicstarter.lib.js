class c_muscistarter{
  LIMIT_IDS_YOUTUBE=10;
  LIMIT_STREAMS=10;
  ARR_IDS_YOUTUBE=[];
  ARR_STREAMS=[];
  del_person(stream){
    // Remove the closed stream from the array
    const index = this.ARR_STREAMS.indexOf(stream);
    if (index !== -1) {
      this.ARR_STREAMS.splice(index, 1);
    }
  }
  async add_person(id_user, stream){
    console.log('new person enter')

    if(this.ARR_STREAMS.length > 10) return false;
    stream.on('close', ()=>{
      this.del_person(stream)
    });  
    this.ARR_STREAMS.push(stream)
    //this.send_event_broadcast('new_person', this.stream)
    console.log(`length videos id: ${this.ARR_IDS_YOUTUBE.length}`)
    const obj = {
      event_type: 'print_list_video',
      event_value: this.ARR_IDS_YOUTUBE
    }
    const instructions = obj
    return instructions

  }
  send_event_broadcast(event_type, event_value){
    console.log('length player online:', this.ARR_STREAMS.length)
    this.ARR_STREAMS.map(stream=>{
      const obj = {
        event_type,
        event_value
      }
      console.log('send event to broadcast', event_type, event_value)
      stream.write(`data: ${JSON.stringify(obj)}\n\n`)
    })
    return
  }
  add_video(id_youtube){

    if(this.ARR_IDS_YOUTUBE.length > 10)
      return false;

    this.ARR_IDS_YOUTUBE.push(id_youtube)
    console.log('length id videos:', this.ARR_IDS_YOUTUBE.length)
    this.send_event_broadcast('add_video', id_youtube)
    return 
  }  
  load_video(id_youtube){

    this.send_event_broadcast('load_video', id_youtube)
  }
  pause_video(id_youtube){
    this.send_event_broadcast('pause_video', id_youtube)
  }
  play_video(id_youtube){
    this.send_event_broadcast('play_video', id_youtube)
  }
  stop_video(id_youtube){
    this.send_event_broadcast('stop_video', id_youtube)
  }
  del_video(id_youtube){

  }
  get_login_params(stream){
    return new Promise((resolve, reject)=>{
      var chunks = [];

      stream.on('data', function (chunk) {
          chunks.push(chunk);
      });
  
      stream.on('end', function () {
          // Here is your body
          var body = Buffer.concat(chunks);
  
          // Not sure if useful
          chunks = [];
          try{
            resolve(JSON.parse(body))
          }catch(err){
            console.error('err: body not json')
            resolve(null)
          }
 
      });
    })

  }
}
module.exports = new c_muscistarter()