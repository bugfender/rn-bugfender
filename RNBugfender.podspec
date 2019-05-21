require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNBugfender"
  s.version      = package['version']
  s.summary      = package['description']
  s.description  = package['description']
  s.license      = package['license']
  s.author       = package['author']
  s.homepage     = package['homepage']
  
  s.platform     = :ios, "9.0"
  s.requires_arc = true
  s.static_framework = true

  s.source       = { :git => "https://github.com/bugfender/BugfenderSDK-iOS", :tag => "master" }
  s.source_files  = 'ios/*.{h,m}'

  s.dependency 'React'
  s.dependency 'BugfenderSDK/ObjC', '~> 1.6'
  
end

  