#import "RnBugfender.h"
#import <BugfenderSDK/BugfenderSDK.h>
#import <React/RCTUtils.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RnBugfenderSpec.h"
#endif

#import "SDKVersion.h"

static NSString *const kBugfenderObfuscateNetworkRequest = @"BugfenderObfuscateNetworkRequest";
static NSString *const kBugfenderObfuscateNetworkResponse = @"BugfenderObfuscateNetworkResponse";

@interface BFPendingObfuscation : NSObject
@property (nonatomic) dispatch_semaphore_t semaphore;
@property (nonatomic, strong) NSDictionary *response;
@end

@implementation BFPendingObfuscation
@end

@interface RnBugfender ()
@property (nonatomic, strong) NSMutableDictionary<NSString *, BFPendingObfuscation *> *pendingObfuscations;
@end

@implementation RnBugfender
RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _pendingObfuscations = [NSMutableDictionary dictionary];
        static dispatch_once_t onceToken;
        dispatch_once(&onceToken, ^{
            [Bugfender setSDKType:@"reactnative" version:SDK_VERSION];
        });
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[kBugfenderObfuscateNetworkRequest, kBugfenderObfuscateNetworkResponse];
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
}

RCT_EXPORT_METHOD(setNetworkLoggingEnabled:(BOOL)enabled)
{
    if ([Bugfender respondsToSelector:@selector(setNetworkLoggingEnabled:)]) {
        [Bugfender setNetworkLoggingEnabled:enabled];
    }
}

RCT_EXPORT_METHOD(setNetworkLoggingCaptureBodies:(BOOL)capture)
{
    if ([Bugfender respondsToSelector:@selector(setNetworkLoggingCaptureBodies:)]) {
        [Bugfender setNetworkLoggingCaptureBodies:capture];
    }
}

RCT_EXPORT_METHOD(setNetworkLoggingCaptureErrorResponseBodies:(BOOL)capture)
{
    if ([Bugfender respondsToSelector:@selector(setNetworkLoggingCaptureErrorResponseBodies:)]) {
        [Bugfender setNetworkLoggingCaptureErrorResponseBodies:capture];
    }
}

RCT_EXPORT_METHOD(setNetworkLoggingURLFilter:(NSArray *)allowlist denylist:(NSArray *)denylist)
{
    if ([Bugfender respondsToSelector:@selector(setNetworkLoggingURLFilterWithAllowlist:denylist:)]) {
        [Bugfender setNetworkLoggingURLFilterWithAllowlist:allowlist denylist:denylist];
    }
}

RCT_EXPORT_METHOD(setNetworkLoggingMaxRequestsPerMinute:(double)count)
{
    if (![Bugfender respondsToSelector:@selector(setNetworkLoggingMaxRequestsPerMinute:)]) {
        return;
    }
    if (count < 0) {
        [Bugfender setNetworkLoggingMaxRequestsPerMinute:nil];
    } else {
        [Bugfender setNetworkLoggingMaxRequestsPerMinute:@((NSInteger)count)];
    }
}

RCT_EXPORT_METHOD(setNetworkLoggingRequestObfuscationHandlerEnabled:(BOOL)enabled)
{
    if (![Bugfender respondsToSelector:@selector(setNetworkLoggingRequestObfuscationHandler:)]) {
        return;
    }
    if (enabled) {
        [self installRequestObfuscationHandler];
    } else {
        [Bugfender setNetworkLoggingRequestObfuscationHandler:nil];
    }
}

RCT_EXPORT_METHOD(setNetworkLoggingResponseObfuscationHandlerEnabled:(BOOL)enabled)
{
    if (![Bugfender respondsToSelector:@selector(setNetworkLoggingResponseObfuscationHandler:)]) {
        return;
    }
    if (enabled) {
        [self installResponseObfuscationHandler];
    } else {
        [Bugfender setNetworkLoggingResponseObfuscationHandler:nil];
    }
}

RCT_EXPORT_METHOD(completeNetworkObfuscation:(NSString *)requestId result:(NSDictionary *)result)
{
    if (requestId.length == 0) {
        return;
    }
    BFPendingObfuscation *pending = nil;
    @synchronized (self.pendingObfuscations) {
        pending = self.pendingObfuscations[requestId];
    }
    if (pending == nil) {
        return;
    }
    pending.response = [result isKindOfClass:[NSDictionary class]] ? result : nil;
    dispatch_semaphore_signal(pending.semaphore);
}

- (NSDictionary *)invokeJSObfuscation:(NSString *)eventName arguments:(NSDictionary *)arguments
{
    // Avoid deadlocking the platform/UI thread while waiting for JS.
    if ([NSThread isMainThread]) {
        return nil;
    }

    NSString *requestId = [[NSUUID UUID] UUIDString];
    BFPendingObfuscation *pending = [[BFPendingObfuscation alloc] init];
    pending.semaphore = dispatch_semaphore_create(0);

    @synchronized (self.pendingObfuscations) {
        self.pendingObfuscations[requestId] = pending;
    }

    NSMutableDictionary *payload = [NSMutableDictionary dictionaryWithDictionary:arguments ?: @{}];
    payload[@"requestId"] = requestId;

    __weak RnBugfender *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        RnBugfender *strongSelf = weakSelf;
        if (strongSelf != nil) {
            [strongSelf sendEventWithName:eventName body:payload];
        }
    });

    long waitResult = dispatch_semaphore_wait(pending.semaphore, dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 * NSEC_PER_SEC)));

    @synchronized (self.pendingObfuscations) {
        [self.pendingObfuscations removeObjectForKey:requestId];
    }

    if (waitResult != 0) {
        return nil;
    }
    return pending.response;
}

- (NSDictionary<NSString *, NSString *> *)stringMapFrom:(id)value
{
    NSMutableDictionary<NSString *, NSString *> *mapped = [NSMutableDictionary dictionary];
    if (![value isKindOfClass:[NSDictionary class]]) {
        return mapped;
    }
    NSDictionary *raw = (NSDictionary *)value;
    for (id key in raw) {
        id entry = raw[key];
        mapped[[key description]] = entry == [NSNull null] || entry == nil ? @"" : [entry description];
    }
    return mapped;
}

- (void)installRequestObfuscationHandler
{
    __weak RnBugfender *weakSelf = self;
    [Bugfender setNetworkLoggingRequestObfuscationHandler:^BFNetworkRequestData * _Nonnull(NSString * _Nonnull url, NSDictionary<NSString *,NSString *> * _Nonnull headers, NSString * _Nullable body) {
        RnBugfender *strongSelf = weakSelf;
        if (strongSelf == nil) {
            return [[BFNetworkRequestData alloc] initWithURL:url headers:headers body:body];
        }

        NSDictionary *response = [strongSelf invokeJSObfuscation:kBugfenderObfuscateNetworkRequest
                                                       arguments:@{
            @"url": url ?: @"",
            @"headers": headers ?: @{},
            @"body": body ?: [NSNull null],
        }];
        if (response == nil) {
            return [[BFNetworkRequestData alloc] initWithURL:url headers:headers body:body];
        }

        NSString *obfuscatedUrl = [response[@"url"] isKindOfClass:[NSString class]] ? response[@"url"] : url;
        NSDictionary<NSString *, NSString *> *obfuscatedHeaders = [strongSelf stringMapFrom:response[@"headers"]];
        NSString *obfuscatedBody = nil;
        if ([response[@"body"] isKindOfClass:[NSString class]]) {
            obfuscatedBody = response[@"body"];
        } else if (response[@"body"] == [NSNull null] || response[@"body"] == nil) {
            obfuscatedBody = nil;
        }
        return [[BFNetworkRequestData alloc] initWithURL:obfuscatedUrl headers:obfuscatedHeaders body:obfuscatedBody];
    }];
}

- (void)installResponseObfuscationHandler
{
    __weak RnBugfender *weakSelf = self;
    [Bugfender setNetworkLoggingResponseObfuscationHandler:^BFNetworkResponseData * _Nonnull(NSDictionary<NSString *,NSString *> * _Nonnull headers, NSString * _Nullable body) {
        RnBugfender *strongSelf = weakSelf;
        if (strongSelf == nil) {
            return [[BFNetworkResponseData alloc] initWithHeaders:headers body:body];
        }

        NSDictionary *response = [strongSelf invokeJSObfuscation:kBugfenderObfuscateNetworkResponse
                                                       arguments:@{
            @"headers": headers ?: @{},
            @"body": body ?: [NSNull null],
        }];
        if (response == nil) {
            return [[BFNetworkResponseData alloc] initWithHeaders:headers body:body];
        }

        NSDictionary<NSString *, NSString *> *obfuscatedHeaders = [strongSelf stringMapFrom:response[@"headers"]];
        NSString *obfuscatedBody = nil;
        if ([response[@"body"] isKindOfClass:[NSString class]]) {
            obfuscatedBody = response[@"body"];
        }
        return [[BFNetworkResponseData alloc] initWithHeaders:obfuscatedHeaders body:obfuscatedBody];
    }];
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
