Parse.Cloud.afterSave('Mail', function (request) {
  var mail = request.object;
  var installationQuery = new Parse.Query(Parse.Installation);

  // select destination devices
  installationQuery.equalTo('residence', mail.get('destinationResidence'));

  // format mail to send as push notification
  var notificationData = {
    type: 'PUSH_NEW_MAIL',
    mail: {
      destination: mail.get('destinationResidence'),
      comment: mail.get('comment'),
      created_by: mail.get('createdBy'),
      created_at: mail.get('createdAt')
    }
  };

  // send push notification
  Parse.Push.send(
    {
      where: installationQuery,
      data: notificationData,
    },
    {
      useMasterKey: true,
      success: function () {
        console.log('Mail ' + mail.id + ' afterSave notification send');
      },
      error: function (error) {
        console.error('Error ', error);
      }
    }
  );
});
