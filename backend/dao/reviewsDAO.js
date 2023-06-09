import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
    } catch (e) {
      console.error(`Unable to establish a collection handle in userDO: ${e}`);
    }
  }

  static async addReview(restaurantId, user, review, date) {
    if(reviews) {
      try {
        const reviewDoc = {
          name: user.name,
          user_id: user._id,
          date: date,
          text: review,
          restaurant_id: new ObjectId(restaurantId),
        };
  
        return await reviews.insertOne(reviewDoc);
      } catch (e) {
        console.error(`Unable to post review: ${e}`);
      }
    } else {
      console.log("BoomPLay ::: 2222 ");
    }
  }

  static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: new ObjectId(reviewId) },
        { $set: { text: text, date: date } }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
    }
  }

  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: new ObjectId(reviewId),
        user_id: userId,
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
    }
  }
}
