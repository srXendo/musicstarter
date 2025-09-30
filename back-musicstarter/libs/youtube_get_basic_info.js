const https = require('node:https');

module.exports = function getBasicInfo(videoId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.youtube.com',
      port: 443,
      path: `/watch?v=${videoId}`,
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
            // Buscar el objeto ytInitialPlayerResponse
            const match = data.match(/ytInitialPlayerResponse\s*=\s*(\{.*?\});/s);
            if (!match) return reject(new Error('No se encontró playerResponse'));

            const playerResponse = JSON.parse(match[1]);
            const videoDetails = playerResponse.videoDetails;
            if(!videoDetails || !videoDetails.videoId){
                return resolve(false)
            }
            resolve({
                id: videoDetails.videoId,
                title: videoDetails.title,
                author: videoDetails.author,
                lengthSeconds: parseInt(videoDetails.lengthSeconds, 10),
                thumbnails: videoDetails.thumbnail?.thumbnails,
            });
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

