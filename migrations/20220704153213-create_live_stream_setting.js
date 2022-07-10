const { generateRoomId, generateStreamId } = require('../src/utils/live-stream-value.util')
const { Collections } = require('../src/models/data.model')
module.exports = {
  async up(db, client) {
    await db.collection(Collections.LiveStreamSetting).insertOne({
      roomId: generateRoomId(),
      streamId: generateStreamId(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
