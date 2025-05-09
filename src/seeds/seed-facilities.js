module.exports = async (dataSource) => {
  const facilitiesRepo = dataSource.getRepository('Facilities');

  const defaultFacilities = [
    { name: '冷氣' },
    { name: '飲水機' },
    { name: '廁所' },
    { name: '吹風機' },
    { name: '淋浴間' },
    { name: '羽球用品販賣' },
    { name: '穿線機' },
    { name: '停車場' },
  ];

  for (const facility of defaultFacilities) {
    const exists = await facilitiesRepo.findOneBy({ name: facility.name });
    if (!exists) {
      await facilitiesRepo.save(facility);
    }
  }
};
