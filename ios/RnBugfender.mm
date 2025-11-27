#import "RnBugfender.h"
#import <BugfenderSDK/BugfenderSDK.h>
#import <React/RCTUtils.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RnBugfenderSpec.h"
#endif

@implementation RnBugfender
RCT_EXPORT_MODULE()

- (instancetype)init
{
    self = [super init];
    if (self) {
        static dispatch_once_t onceToken;
        dispatch_once(&onceToken, ^{
            [Bugfender setSDKType:@"reactnative"];
        });
    }
    return self;
}

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

RCT_EXPORT_METHOD(info:(NSString *)tag text:(NSString *)text)
{
    BFLog2(BFLogLevelInfo, tag, @"%@", text);
}

RCT_EXPORT_METHOD(trace:(NSString *)tag text:(NSString *)text)
{
    BFLog2(BFLogLevelTrace, tag, @"%@", text);
}

RCT_EXPORT_METHOD(fatal:(NSString *)tag text:(NSString *)text)
{
    BFLog2(BFLogLevelFatal, tag, @"%@", text);
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

RCT_EXPORT_METHOD(log:(int)lineNumber method:(NSString *)method file:(NSString *)file logLevel:(int)rawLogLevel tag:(NSString *)tag  message:(NSString *)message)
{
    BFLogLevel logLevel = BFLogLevelDefault;
    if (rawLogLevel == 1)
        logLevel = BFLogLevelWarning;
    else if (rawLogLevel == 2)
        logLevel = BFLogLevelError;
    else if (rawLogLevel == 3)
        logLevel = BFLogLevelTrace;
    else if (rawLogLevel == 4)
        logLevel = BFLogLevelInfo;
    else if (rawLogLevel == 5)
        logLevel = BFLogLevelFatal;
    
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

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRnBugfenderSpecJSI>(params);
}
#endif

@end
