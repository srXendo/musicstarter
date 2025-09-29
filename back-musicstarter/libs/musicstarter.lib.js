class c_muscistarter{
  LIMIT_IDS_YOUTUBE=10;
  LIMIT_STREAMS=10;
  ARR_IDS_YOUTUBE=[];
  ARR_STREAMS=[];
  OBJ_ROOMS = {
  }
  ROOMS_LENGTH = 0
  get_rooms(){
    return Object.values(this.OBJ_ROOMS)
  }
  create_room(id_user){
    this.OBJ_ROOMS[this.ROOMS_LENGTH] = {
      admin_user: id_user,
      obj_house: {},
      arr_ids_videos: []
    }
    const old_length = this.ROOMS_LENGTH
    this.ROOMS_LENGTH++
    return old_length
  }
  del_person(id_user, id_room){
    // Remove the closed stream from the array
    this.OBJ_ROOMS[id_room].obj_house[id_user] = undefined
  }
  async add_person(id_user, stream, id_room){
    console.log('new person enter')
    if(!this.OBJ_ROOMS[id_room]) return false;
    stream.on('close', ()=>{
      this.del_person(id_user, id_room)
    });  
    if(!this.OBJ_ROOMS[id_room].obj_house[id_user]){
      this.OBJ_ROOMS[id_room].obj_house[id_user] = {
        stream: stream
      }
    }
    this.OBJ_ROOMS[id_room].obj_house[id_user].stream = stream
    //this.send_event_broadcast('new_person', this.stream, id_room)
    console.log(`length videos id: ${this.OBJ_ROOMS[id_room].arr_ids_videos.length}`)
    const obj = {
      event_type: 'print_list_video',
      event_value: this.OBJ_ROOMS[id_room].arr_ids_videos
    }
    const instructions = obj
    return instructions

  }
  send_event_broadcast(event_type, event_value, id_room){
    for(let id_usr in this.OBJ_ROOMS[id_room].obj_house){

      console.log('send event to broadcast', event_type, event_value)
      this.OBJ_ROOMS[id_room].obj_house[id_usr].stream.write(`data: ${JSON.stringify({
        event_type,
        event_value
      })}\n\n`)
    }
    console.log(`length player online in room: ${Object.keys(this.OBJ_ROOMS[id_room].obj_house).length}` )
    return
  }
  add_video(id_youtube, id_room){

    this.OBJ_ROOMS[id_room].arr_ids_videos.push(id_youtube)
    this.send_event_broadcast('add_video', id_youtube, id_room)
    return 
  }  
  load_video(id_youtube, id_room){

    this.send_event_broadcast('load_video', id_youtube, id_room)
    return
  }
  pause_video(id_youtube, id_room){
    this.send_event_broadcast('pause_video', id_youtube, id_room)
    return
  }
  play_video(id_youtube, id_room){
    this.send_event_broadcast('play_video', id_youtube, id_room)
    return
  }
  
  previous_video(id_youtube, id_room){
    const idx_actual = this.OBJ_ROOMS[id_room].arr_ids_videos.indexOf(id_youtube)
    let next_idx = this.OBJ_ROOMS[id_room].arr_ids_videos.length - 1
    if(idx_actual - 1 >= 0){
      next_idx = idx_actual - 1
    }
    console.log(`previews: ${next_idx} --- ${this.OBJ_ROOMS[id_room].arr_ids_videos[next_idx]}`)
    this.send_event_broadcast('load_video', this.OBJ_ROOMS[id_room].arr_ids_videos[next_idx], id_room)
    return
  }
  next_video(id_youtube, id_room){
    const idx_actual = this.OBJ_ROOMS[id_room].arr_ids_videos.indexOf(id_youtube)
    let next_idx = 0
    if(idx_actual + 1 <= this.OBJ_ROOMS[id_room].arr_ids_videos.length -1){
      next_idx = idx_actual + 1
    }
    console.log(`next: ${next_idx} ---  ${this.OBJ_ROOMS[id_room].arr_ids_videos[next_idx]}`)
    this.send_event_broadcast('load_video', this.OBJ_ROOMS[id_room].arr_ids_videos[next_idx], id_room)
    return
  }
  stop_video(id_youtube, id_room){
    this.send_event_broadcast('stop_video', id_youtube, id_room)
    return
  }
  del_video(id_youtube, id_room){

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