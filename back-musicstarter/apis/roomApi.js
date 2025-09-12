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
    this.router.set_route("GET", "/load_video/:id_video", this.loadVideo.bind(this));
    this.router.set_route("GET", "/add_video/:id_video", this.addVideo.bind(this));
    this.router.set_route("GET", "/pause_video/:id_video", this.pauseVideo.bind(this));
    this.router.set_route("GET", "/play_video/:id_video", this.playVideo.bind(this));
    this.router.set_route("GET", "/stop_video/:id_video", this.stopVideo.bind(this));

    // server status
    this.router.set_route("GET", "/server", this.server.bind(this));

    // add friend
    this.router.set_route("POST", "/add_friend", this.addFriend.bind(this));
  }


  async loadVideo(stream, headers, params) {
    const id_youtube = params.id_video;
    musicstarter.add_video(id_youtube);

    return [false, 204]
  }

  async addVideo(stream, headers, params) {
    console.log('add videos', params)
    const id_youtube = params.id_video;

    musicstarter.add_video(id_youtube);
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
    musicstarter.pause_video(id_youtube);

    return [false, 204]
  }

  async playVideo(stream, headers, params) {
    const id_youtube = params.id_video;
    musicstarter.play_video(id_youtube);

    return [false, 204]
  }

  async stopVideo(stream, headers, params) {
    const id_youtube = params.id_video;
    musicstarter.stop_video(id_youtube)
    return [false, 204]
  }

  async server(stream, headers) {

    let params = new URLSearchParams(headers['cookie']);
    const id_user = params.get("musicstarterSession");
    console.log(params)
    if (id_user === null) {

      return [false, 404, {}];
    }

    const res_add_person = await musicstarter.add_person(id_user, stream);
    const response =  {
      "access-control-allow-origin": `${process.env.PROT_FRONT}://${process.env.DOMAIN_FRONT}:${process.env.PORT_FRONT}`,
      "access-control-allow-methods": "GET,POST,OPTIONS,PUT",
      'Access-Control-Allow-Credentials': true,
      "access-control-allow-headers": "Content-Type, Cookies",
      'content-type': 'text/event-stream; charset=utf-8',
      "cache-control": "no-cache",
      ":status": 200,
    }
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