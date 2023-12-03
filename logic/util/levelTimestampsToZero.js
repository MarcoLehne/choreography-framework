function levelTimestampsToZero(choreoObject, fromTimestampIndex) {
  if (fromTimestampIndex < 0 || fromTimestampIndex >= choreoObject.view.length) {
      console.error('Invalid fromTimestampIndex');
      return;
  }

  const levelingAmount = Number(choreoObject.view[fromTimestampIndex].timestamp);

  choreoObject.view.forEach((item, index) => {
      if (index >= fromTimestampIndex) {
          const newTimestamp = Number(item.timestamp) - levelingAmount;
          item.timestamp = newTimestamp.toString();
      }
  });
}

module.exports = levelTimestampsToZero;