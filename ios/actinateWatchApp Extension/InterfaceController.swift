//
//  InterfaceController.swift
//  testing WatchKit Extension
//
//  Created by Mensur Bektic on 05.04.20.
//  Copyright © 2020 Mensur Bektic. All rights reserved.
//

import WatchKit
import Foundation
import WatchConnectivity



class InterfaceController: WKInterfaceController, WCSessionDelegate {
  @IBOutlet weak var greenButton: WKInterfaceButton!
  @IBOutlet weak var yellowButton: WKInterfaceButton!
  @IBOutlet weak var redButton: WKInterfaceButton!
  
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}
  
  func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
    print("watch received message", message);
    let currentLight = message["text"] as! String
    setCurrentLight(currentLight: currentLight)
  }
  var session: WCSession?
  
  override func awake(withContext context: Any?) {
    super.awake(withContext: context)
    
    if WCSession.isSupported() {
      self.session = WCSession.default
      self.session?.delegate = self
      self.session?.activate()
    }
  }
  
  override func willActivate() {
    // This method is called when watch view controller is about to be visible to user
    super.willActivate()
  }
  
  override func didDeactivate() {
    // This method is called when watch view controller is no longer visible
    super.didDeactivate()
  }
  
  func setCurrentLight(currentLight: String) {
    resetButtonColors()
    
    switch currentLight {
    case "green":
      greenButton.setBackgroundColor(UIColor.green)
    case "yellow":
      yellowButton.setBackgroundColor(UIColor.yellow)
    case "red":
      redButton.setBackgroundColor(UIColor.red)
    default:
      break
    }
  }
  
  func sendMessageToApp(currentLight: String) {
    resetButtonColors()
    setCurrentLight(currentLight: currentLight)
    print("Sending response")
    session?.sendMessage(["message": currentLight], replyHandler: { (dict) in
      print("Received response")
    }, errorHandler: nil)
  }
  
  func resetButtonColors() {
    greenButton.setBackgroundColor(UIColor.white)
    yellowButton.setBackgroundColor(UIColor.white)
    redButton.setBackgroundColor(UIColor.white)
  }
  @IBAction func onGreenPressed() {
    sendMessageToApp(currentLight: "green")
  }
  @IBAction func onYellowPressed() {
    sendMessageToApp(currentLight:"yellow")
  }
  @IBAction func onRedPressed() {
    sendMessageToApp(currentLight:"red")
  }
}
