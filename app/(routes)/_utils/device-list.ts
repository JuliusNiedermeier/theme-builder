interface Device {
  key: string;
  width: number;
}

export const deviceWidthMap: Record<string, number> = {
  "iMac 4.5K 24″": 2240,
  "Surface Book 15″": 1620,
  "iPad Pro 12.9″": 1024,
  "iPad Pro 11″": 1024,
  "iPad Air": 820,
  "iPhone 16": 393,
  "iPhone 16 Plus": 430,
};

export const deviceList: Device[] = Object.keys(deviceWidthMap)
  .map((key) => ({ key, width: deviceWidthMap[key] }))
  .sort((a, b) => a.width - b.width);

if (!deviceList.length) throw new Error("Device list is empty");

export const getClosestDevice = (width: number): Device => {
  return deviceList.reduce((best, cur) => (Math.abs(cur.width - width) < Math.abs(best.width - width) ? cur : best));
};
