const routerApi = require("./routerApi");
const musicstarter = require('./../libs/musicstarter.lib');

const AUsers = null

class RoomApi {
  router = new routerApi('/api/room');
  
  constructor() {
    this.registerRoutes();
  }

  registerRoutes() {
    // videos
    this.router.set_route("GET", "/load_video/:id_room/:id_video", this.loadVideo.bind(this));
    this.router.set_route("GET", "/add_video/:id_room/:id_video", this.addVideo.bind(this));
    this.router.set_route("GET", "/pause_video/:id_room/:id_video", this.pauseVideo.bind(this));
    this.router.set_route("GET", "/play_video/:id_room/:id_video", this.playVideo.bind(this));
    this.router.set_route("GET", "/stop_video/:id_room/:id_video", this.stopVideo.bind(this));
    this.router.set_route("GET", "/previous_video/:id_room/:id_video", this.previousVideo.bind(this));
    this.router.set_route("GET", "/next_video/:id_room/:id_video", this.nextVideo.bind(this));

    // server status
    this.router.set_route("GET", "/server/:id_room", this.server.bind(this));

    //hub
    this.router.set_route("PUT", "/hub", this.createHub.bind(this));
    this.router.set_route("GET", "/hub", this.getHub.bind(this));
  }
  getHub(stream, headers){
      // Middleware CORS sencillo
      
    let params = new URLSearchParams(headers['cookie']);
    const id_user = params.get("musicstarterSession");
    console.log(params)
    if (id_user === null) {

      return [false, 404, {}];
    }
    return [false, 200, musicstarter.get_rooms()]
  }
  createHub(stream, headers) {
    let params = new URLSearchParams(headers['cookie']);
    const id_user = params.get("musicstarterSession");
    console.log(params)
    if (id_user === null) {
      return [false, 403, {}];
    }
    const id_room = musicstarter.create_room(id_user)
    return [false, 200, {id_room: id_room, id_admin: id_user, obj_house: {}, arr_ids_videos: []}]
  }

  async loadVideo(stream, headers, params) {
    const id_youtube = params.id_video;
    const id_room = params.id_room
    /*musicstarter.add_video(id_youtube, id_room);*/
    musicstarter.load_video(id_youtube, id_room);
    return [false, 204]
  }

  async addVideo(stream, headers, params) {
    console.log('add videos', params)
    const id_youtube = params.id_video;
    const id_room = params.id_room
    musicstarter.add_video(id_youtube, id_room);
    const response =  {
      "access-control-allow-origin": `${process.env.PROT_FRONT}://${process.env.DOMAIN_FRONT}:${process.env.PORT_FRONT}`,
      "access-control-allow-methods": "GET,POST,OPTIONS,PUT",
      'Access-Control-Allow-Credentials': true,
      "access-control-allow-headers": "Content-Type, Cookies",
      'content-type': 'application/javascript; charset=utf-8',
      ":status": 200,
    }
    console.log('add videos')
    stream.respond(response)
    stream.write('')
    stream.end()
    return null
  }

  async pauseVideo(stream, headers, params) {
    const id_youtube = params.id_video;
    const id_room = params.id_room
    musicstarter.pause_video(id_youtube, id_room);

    return [false, 204]
  }

  async playVideo(stream, headers, params) {
    const id_youtube = params.id_video;
    const id_room = params.id_room

    musicstarter.play_video(id_youtube, id_room);

    return [false, 204]
  }
  async previousVideo(stream, headers, params) {
    const id_youtube = params.id_video;
    const id_room = params.id_room

    musicstarter.previous_video(id_youtube, id_room);

    return [false, 204]
  }
  async nextVideo(stream, headers, params) {
    const id_youtube = params.id_video;
    const id_room = params.id_room

    musicstarter.next_video(id_youtube, id_room);

    return [false, 204]
  }
  async stopVideo(stream, headers, params) {
    const id_youtube = params.id_video;
    const id_room = params.id_room
    musicstarter.stop_video(id_youtube, id_room)
    return [false, 204]
  }

  async server(stream, headers, params) {

    let cookieunser = new URLSearchParams(headers['cookie']);
    const id_user = cookieunser.get("musicstarterSession");
    
    if (id_user === null) {

      return [false, 404, {}];
    }
    const id_room = params.id_room
    const res_add_person = await musicstarter.add_person(id_user, stream, id_room);
    const response =  {
      "access-control-allow-origin": `${process.env.PROT_FRONT}://${process.env.DOMAIN_FRONT}:${process.env.PORT_FRONT}`,
      "access-control-allow-methods": "GET,POST,OPTIONS,PUT",
      'Access-Control-Allow-Credentials': true,
      "access-control-allow-headers": "Content-Type, Cookies",
      'content-type': 'text/event-stream; charset=utf-8',
      "cache-control": "no-cache",
      ":status": 200,
    }
    console.log('room server: ', res_add_person)
    stream.respond(response)
    stream.write(`data: ${JSON.stringify(res_add_person)}\n\n`)
    return null 
  }

  async addFriend(stream, headers) {
    console.log(headers['cookie']);
    let params = new URLSearchParams(headers['cookie']);
    const id_user = params.get("id_user");

    if (id_user === null) {
      return [true, 403]
    }

    const unsafe_body = await musicstarter.get_login_params(stream);

    if (unsafe_body !== null && (unsafe_body.email && unsafe_body.email.indexOf('@') > -1)) {
      await new AUsers().add_friend(stream, unsafe_body, id_user);
    } else {

      return [true, 403]
    }
  }
}

module.exports = new RoomApi().router;