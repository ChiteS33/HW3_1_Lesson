export const deviceFinalMake = (result: any): any => {
    return {
        ip: result.ip.toString(),
        title: result.deviceName,
        lastActiveDate: result.iat.toString(),
        deviceId: result.deviceId.toString(),
    }

}