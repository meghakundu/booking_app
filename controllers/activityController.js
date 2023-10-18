var Contact = require('../models/contact');
var Outdoor_activity = require('../models/outdoor_activity');
var fetchAssignedBooks = async function index(req, res)
{
  // fetchs the book and users information.
    try {
      var assignedInfo = Outdoor_activity.findAll().then({
        include: [
          {
            model: Contact,
            attributes: ["name", "checkin","checkout"],
            
          },
        ],
      });
      console.log(assignedInfo);
   } catch (error) {
        console.log(error);
    }

};
console.log(fetchAssignedBooks);
module.exports = fetchAssignedBooks;