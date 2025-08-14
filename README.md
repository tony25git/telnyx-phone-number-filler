# 📞 Telnyx Phone Number Filler

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=flat-square&logo=googlechrome)
![Edge Extension](https://img.shields.io/badge/Edge-Extension-blue?style=flat-square&logo=microsoftedge)
![Version](https://img.shields.io/badge/Version-1.0-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

A powerful Chrome/Edge extension that automatically fills phone numbers into carrier websites for telecommunications workflows.

## ✨ Key Features

🎯 **Multi-Carrier Support** - Works with AT&T, Comcast, L3, and Verizon platforms  
🤖 **Smart Field Detection** - Automatically finds the correct input fields on carrier websites  
📈 **Range Detection** - Groups consecutive phone numbers for efficient entry  
⚡ **Instant Filling** - One-click phone number insertion into active web forms  
🔒 **Privacy-First** - All processing happens locally, no data transmitted  

## 🚀 Quick Start

### Install the Extension

1. **[📥 Download Latest Release](../../releases/latest)**
2. **Extract** the downloaded ZIP file
3. **Open Chrome/Edge** and go to `chrome://extensions/` or `edge://extensions/`
4. **Enable "Developer mode"** (toggle in top-right corner)
5. **Click "Load unpacked"** and select the extracted folder
6. **Pin the extension** to your toolbar for easy access

### Basic Usage

1. **Navigate** to a supported carrier website
2. **Click the extension icon** in your browser toolbar
3. **Enter phone numbers** in the text area (one per line)
4. **Select carrier** from the dropdown
5. **Click "Paste to Active Page"** to fill the form automatically

## 🏢 Supported Carriers

### **AT&T** 
- **Websites**: corp.att.com, local-service-request pages
- **Auto-detects**: Phone number input fields
- **Features**: Range support for consecutive numbers

### **Comcast**
- **Websites**: Comcast business portals
- **Auto-detects**: Service request forms
- **Features**: Intelligent field targeting

### **Level 3 (L3)**
- **Websites**: Level3/CenturyLink platforms
- **Auto-detects**: Port order forms
- **Features**: Bulk number entry support

### **Verizon**
- **Websites**: Verizon business platforms  
- **Auto-detects**: Service activation forms
- **Features**: Smart form completion

## 📊 How It Works

### **Range Detection**
The extension automatically detects consecutive phone numbers:

**Input:**
```
2345678901
2345678902
2345678903
2345678904
```

**Detected Range:**
- Area Code: 234
- Exchange: 567
- Range: 8901-8904

### **Smart Field Targeting**
Based on the selected carrier, the extension:
1. **Scans the webpage** for relevant input fields
2. **Identifies** phone number fields by type and context
3. **Fills** the appropriate fields with formatted numbers
4. **Confirms** successful entry with status feedback

## 💻 Technical Features

### **Input Flexibility**
- **Accepts**: Any 10-digit phone number format
- **Cleans**: Automatically removes formatting (spaces, dashes, parentheses)
- **Validates**: Ensures only valid phone numbers are processed
- **Supports**: Multiple numbers per session

### **Website Integration**
- **Content Script**: Runs on carrier websites to enable field detection
- **Popup Interface**: User-friendly control panel
- **Background Process**: Handles carrier-specific logic
- **Error Handling**: Graceful failure with user feedback

### **Browser Compatibility**
- ✅ **Chrome** 88+ (Recommended)
- ✅ **Edge** (Chromium-based) 88+
- ✅ **Other Chromium browsers** with Manifest V3 support

## 📸 Screenshots

| Feature | Preview |
|---------|---------|
| **Main Interface** | *Extension popup with phone number input and carrier selection* |
| **Range Detection** | *Automatic grouping of consecutive phone numbers* |
| **Field Targeting** | *Smart detection and filling of carrier website forms* |

## 🎯 Use Cases

### **Telecommunications Professionals**
- **Port Orders**: Bulk entry of phone numbers for porting
- **Service Requests**: Quick form completion on carrier platforms
- **Number Management**: Efficient handling of consecutive number blocks

### **Business Operations**
- **Account Setup**: Rapid deployment of phone number assignments  
- **Service Activation**: Streamlined carrier website interactions
- **Data Entry**: Reduced manual typing and errors

## 🔧 Installation & Setup

### **System Requirements**
- Chrome 88+ or Edge (Chromium-based) 88+
- Windows, Mac, or Linux
- Active internet connection for carrier website access

### **Step-by-Step Installation**

1. **Download the Extension**
   - Go to [Releases](../../releases/latest)
   - Download the latest ZIP file
   - Extract to a folder on your computer

2. **Load in Browser**
   - Open Chrome/Edge extensions page
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the extracted extension folder

3. **First Use**
   - Navigate to a carrier website
   - Click the extension icon
   - Test with sample phone numbers

### **Configuration**
- **Default Carrier**: AT&T (can be changed per session)
- **Field Detection**: Automatic (no configuration needed)
- **Number Format**: Accepts any 10-digit US format

## 🛠️ Development & Contributing

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/yourusername/telnyx-phone-number-filler.git
cd telnyx-phone-number-filler

# Load the extension/ folder in Chrome Developer mode
# Make your changes and test locally
```

### **File Structure**
```
extension/
├── manifest.json       # Extension configuration
├── popup.html         # User interface
├── popup.js           # Popup functionality
├── content.js         # Website interaction logic
├── background.js      # Background processing
└── README.md          # Documentation
```

### **Contributing**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/carrier-support`)
3. **Commit** your changes (`git commit -m 'Add new carrier support'`)
4. **Push** to the branch (`git push origin feature/carrier-support`)
5. **Open** a Pull Request

## 📋 Changelog

### **v1.0 - Initial Release**
- 🎉 **Multi-carrier support** (AT&T, Comcast, L3, Verizon)
- 🎉 **Smart field detection** for carrier websites
- 🎉 **Range detection** for consecutive phone numbers
- 🎉 **One-click form filling** functionality
- 🎉 **Error handling** and user feedback
- 🎉 **Privacy-focused** local processing

[📜 View Full Release History](../../releases)

## 🆘 Troubleshooting

### **Common Issues**

**❓ Extension not filling forms?**
- Ensure you're on a supported carrier website
- Select the correct carrier from the dropdown
- Click on an input field first, then try filling
- Check that phone numbers are in 10-digit format

**❓ "Failed to paste" error?**
- Refresh the carrier website page
- Try clicking on a phone number input field first
- Ensure the website has loaded completely
- Check browser console for additional error details

**❓ Range detection not working?**
- Enter consecutive numbers (e.g., 2345678901, 2345678902, 2345678903)
- Numbers must have same area code and exchange
- Only the subscriber portion should be consecutive

**❓ Carrier website not recognized?**
- Verify the website URL is supported
- Try selecting a different carrier option
- Some carrier sites may require specific URL patterns
- Report new sites that should be supported

### **Getting Help**

- 🐛 **Report Bugs**: [Create an Issue](../../issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Create an Issue](../../issues/new?template=feature_request.md)
- 📖 **Documentation**: [Installation Guide](INSTALL.md)
- 💬 **Discussions**: [GitHub Discussions](../../discussions)

## 📄 Technical Details

### **Permissions**
- **activeTab**: Access current tab for form filling
- **tabs**: Query active tab information
- **scripting**: Inject content scripts for carrier websites

### **Security & Privacy**
- 🔒 **No data collection** - Extension doesn't track or store user data
- 🔒 **Local processing** - All phone number handling happens in browser
- 🔒 **Minimal permissions** - Only requests necessary browser access
- 🔒 **No external calls** - No data sent to external servers

### **Performance**
- ⚡ **Fast field detection** - Efficient DOM scanning
- 💾 **Low memory usage** - Optimized for minimal resource consumption
- 🔄 **Background processing** - Won't slow down browsing experience

## 🏢 About Telnyx

This extension was created to streamline telecommunications workflows for Telnyx operations but is useful for anyone working with carrier platforms.

**Learn more**: [telnyx.com](https://telnyx.com)

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for the telecommunications industry

[🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues) · [💬 Discuss](../../discussions)

</div>
