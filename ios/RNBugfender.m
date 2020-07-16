#import "RNBugfender.h"
#import <BugfenderSDK/BugfenderSDK.h>
#import <React/RCTUtils.h>

@implementation RNBugfender

RCT_EXPORT_MODULE(RNBugfender);

RCT_EXPORT_METHOD(activateLogger:(NSString *)key)
{
    NSLog(@"Activate logger with key %@",key);
    [Bugfender activateLogger:key];
}

RCT_EXPORT_METHOD(setApiUrl:(NSString *)apiUrl)
{
    NSURL *url = [NSURL URLWithString:apiUrl];
    [Bugfender setApiURL:url];
}

RCT_EXPORT_METHOD(setBaseUrl:(NSString *)apiUrl)
{
    NSURL *url = [NSURL URLWithString:apiUrl];
    [Bugfender setBaseURL:url];
}

RCT_EXPORT_METHOD(setForceEnabled:(BOOL)enabled)
{
    [Bugfender setForceEnabled:enabled];
}

RCT_EXPORT_METHOD(overrideDeviceName:(NSString *)deviceName)
{
    [Bugfender overrideDeviceName:deviceName];
}

RCT_EXPORT_METHOD(setMaximumLocalStorageSize:(int)size)
{
    [Bugfender setMaximumLocalStorageSize:size];
}

RCT_REMAP_METHOD(getDeviceUrl,
                 getDeviceUrlWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([Bugfender deviceIdentifierUrl].absoluteString);
}

RCT_REMAP_METHOD(getSessionUrl,
                 getSessionUrlWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([Bugfender sessionIdentifierUrl].absoluteString);
}

RCT_EXPORT_METHOD(removeDeviceKey:(NSString *)key)
{
    [Bugfender removeDeviceKey:key];
}

RCT_EXPORT_METHOD(enableLogcatLogging)
{
    NSLog(@"Not available on iOS");
}

RCT_EXPORT_METHOD(enableCrashReporting)
{
    [Bugfender enableCrashReporting];
}

RCT_EXPORT_METHOD(enableUIEventLogging)
{
    [Bugfender enableUIEventLogging];
}

// This methods have a weird naming convention because the Android dev wrote the RN pluging prior to the iOS dev
RCT_EXPORT_METHOD(setDeviceBoolean:(NSString *)deviceKey boolValue:(BOOL)boolValue)
{
    [Bugfender setDeviceBOOL:boolValue forKey:deviceKey];
}

RCT_EXPORT_METHOD(setDeviceString:(NSString *)deviceKey stringValue:(NSString *)stringValue)
{
    [Bugfender setDeviceString:stringValue forKey:deviceKey];
}

RCT_EXPORT_METHOD(setDeviceInteger:(NSString *)deviceKey intValue:(int)intValue)
{
    [Bugfender setDeviceInteger:intValue forKey:deviceKey];
}

RCT_EXPORT_METHOD(setDeviceFloat:(NSString *)deviceKey floatValue:(float)floatValue)
{
    [Bugfender setDeviceDouble:floatValue forKey:deviceKey];
}

RCT_EXPORT_METHOD(debug:(NSString *)tag text:(NSString *)text)
{
    BFLog2(BFLogLevelDefault, tag, @"%@", text);
}

RCT_EXPORT_METHOD(warning:(NSString *)tag text:(NSString *)text)
{
    BFLog2(BFLogLevelWarning, tag, @"%@", text);
}

RCT_EXPORT_METHOD(error:(NSString *)tag text:(NSString *)text)
{
    BFLog2(BFLogLevelError, tag, @"%@", text);
}

RCT_EXPORT_METHOD(log:(int)lineNumber method:(NSString *)method file:(NSString *)file logLevel:(NSString *)rawLogLevel tag:(NSString *)tag  message:(NSString *)message)
{
    BFLogLevel logLevel = BFLogLevelDefault;
    if ([rawLogLevel isEqualToString:@"Error"])
        logLevel = BFLogLevelError;
    else if ([rawLogLevel isEqualToString:@"Warning"])
        logLevel = BFLogLevelWarning;
    
    [Bugfender logWithLineNumber:lineNumber method:method file:file level:logLevel tag:tag message:message];
}

RCT_EXPORT_METHOD(sendIssue:(NSString *)tag text:(NSString *)text urlResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([Bugfender sendIssueReturningUrlWithTitle:tag text:text].absoluteString);
}

RCT_EXPORT_METHOD(sendCrash:(NSString *)title text:(NSString *)text urlResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([Bugfender sendCrashWithTitle:title text:text].absoluteString);
}

RCT_EXPORT_METHOD(forceSendOnce)
{
    [Bugfender forceSendOnce];
}

RCT_EXPORT_METHOD(sendUserFeedback:(NSString *)title text:(NSString *)text urlResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([Bugfender sendUserFeedbackReturningUrlWithSubject:title message:text].absoluteString);
}

RCT_EXPORT_METHOD(showUserFeedback:(NSString *)title hint:(NSString *)hint subjectHint:(NSString *)subjectHint messageHint:(NSString *)messageHint sendButtonText:(NSString *)sendButtonText cancelButtonText:(NSString *)cancelButtonText resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    UIViewController * controller = [Bugfender userFeedbackViewControllerWithTitle:title
                                                                              hint:hint
                                                                subjectPlaceholder:subjectHint
                                                                messagePlaceholder:messageHint
                                                                   sendButtonTitle:sendButtonText
                                                                 cancelButtonTitle:cancelButtonText
                                                                        completion:^(BOOL feedbackSent, NSURL * _Nullable url) {
        if (feedbackSent) {
            resolve(url.absoluteString);
        } else {
            reject(0, @"Feedback not sent", nil);
        }
    }];
    
    UIViewController* vc = RCTPresentedViewController();
    [vc presentViewController:controller animated:YES completion:nil];

    /*
     * Another option might be using the window.
     * But this code might not work for complex native setup, for simple cases, might work
     * [UIApplication.sharedApplication.delegate.window.rootViewController presentViewController:controller animated:YES completion:nil];
     */
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

@end
