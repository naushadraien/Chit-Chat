import DeviceInfo from "react-native-device-info";

export const getDeviceData = async () => {
  const info = {
    appName: DeviceInfo.getApplicationName(),
    appVersion: DeviceInfo.getVersion(),
    buildNumber: DeviceInfo.getBuildNumber(),
    bundleId: DeviceInfo.getBundleId(),

    deviceId: DeviceInfo.getDeviceId(),
    deviceName: await DeviceInfo.getDeviceName(),
    brand: DeviceInfo.getBrand(),
    model: DeviceInfo.getModel(),
    systemName: DeviceInfo.getSystemName(),
    systemVersion: DeviceInfo.getSystemVersion(),
    manufacturer: await DeviceInfo.getManufacturer(),

    uniqueId: await DeviceInfo.getUniqueId(),
    isEmulator: await DeviceInfo.isEmulator(),
    isTablet: DeviceInfo.isTablet(),
    deviceType: DeviceInfo.getDeviceType(),
  };

  console.log(info);
  return info;
};
