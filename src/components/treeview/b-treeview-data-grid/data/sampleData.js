
export default
[
  {
    id: 1,
    resultType: 2,
    name: 'Limit ve Teminat Kontrolü',
    toggled: true,
    level: 1,
    children: [
      {
        toggled: false,
        resultType: 0,
        id: 119,
        level: 2,
        name: 'Diğer Ürünler Limit ve Risk',
        children: {
          id: 111,
          level: 3,
          name: 'Example',
          columns: [
              { key: 'name', name: 'Name', width: 70 },
              { key: 'gender', name: 'Gender', width: 70 },
              { key: 'phone', name: 'Phone', width: 200 },
          ],
          datasource: [
              { name: 'name', gender: 'tır', width: 70 },
              { name: 'ornek', gender: 'tır', phone: 'tırcı' },
              { name: 'isim', gender: 'tır', phone: 'tırcı' }
          ]
        }
      },
      {
        toggled: true,
        resultType: 1,
        id: 79,
        level: 2,
        name: 'Tahsis Durumu',
        children: {
          id: 170,
          level: 3,
          name: 'Example',
          columns: [
              { key: 'tel', name: 'Phone', width: 70 },
              { key: 'd12', name: 'Phone a', width: 70 },
              { key: 'd13', name: 'Phone ac', width: 70 },
              { key: 'd14', name: 'Phone acı', width: 70 },
              { key: 'd15', name: 'Phone acık', width: 70 },
              { key: 'd16', name: 'Phone acıkl', width: 70 },
              { key: 'd17', name: 'Phone acıkla', width: 70 },
              { key: 'd18', name: 'Phone acıklam', width: 70 },
              { key: 'd19', name: 'Phone acıklama', width: 70 }
          ],
          datasource: [
              { tel: 'phonee', d12: 'tır' },
              { tel: 'phofgdnee', d12: 'tır', d19: 'tırcı dayı' }
          ]
        }
      }
    ]
  }
];
