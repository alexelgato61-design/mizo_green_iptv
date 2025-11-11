# Mizo Green IPTV

A simple and lightweight IPTV player that supports M3U playlist files. This application allows you to manage and view IPTV channels from local files or remote URLs.

## Features

- 📺 Parse M3U/M3U8 playlist files
- 🌐 Support for both local files and remote URLs
- 📋 List all available channels
- 🏷️ Organize channels by groups
- 🔍 Search and filter channels
- ℹ️ Display detailed channel information
- 🎯 Simple command-line interface

## Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/alexelgato61-design/mizo_green_iptv.git
cd mizo_green_iptv
```

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Commands

#### List all channels
```bash
python mizo_green_iptv.py --playlist playlist.m3u --list
```

#### List channels from a remote URL
```bash
python mizo_green_iptv.py --playlist https://example.com/playlist.m3u --list
```

#### Show all channel groups
```bash
python mizo_green_iptv.py --playlist playlist.m3u --groups
```

#### Filter channels by group
```bash
python mizo_green_iptv.py --playlist playlist.m3u --group "News" --list
```

#### Get channel information
```bash
python mizo_green_iptv.py --playlist playlist.m3u --info "Channel Name"
```

#### Play a channel
```bash
python mizo_green_iptv.py --playlist playlist.m3u --play "Channel Name"
```

### Configuration

You can create a `config.ini` file to set default options. Copy the example configuration:

```bash
cp config.ini.example config.ini
```

Edit `config.ini` to customize your settings.

### Playlist Format

The application supports standard M3U playlist format. Example:

```m3u
#EXTM3U
#EXTINF:-1 tvg-id="news1" tvg-logo="https://example.com/logo.png" group-title="News",News Channel
https://example.com/stream/news.m3u8
```

Copy `playlist.m3u.example` to `playlist.m3u` and add your own channels.

## Project Structure

```
mizo_green_iptv/
├── mizo_green_iptv.py      # Main application
├── requirements.txt         # Python dependencies
├── config.ini.example      # Example configuration
├── playlist.m3u.example    # Example playlist
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Command-Line Options

```
Options:
  -h, --help            Show help message and exit
  -c, --config CONFIG   Configuration file path
  -p, --playlist PATH   Path or URL to M3U playlist file
  -l, --list           List all channels
  -g, --groups         List all channel groups
  --group GROUP        Filter channels by group
  --play CHANNEL       Play a specific channel by name
  --info CHANNEL       Show information about a specific channel
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Disclaimer

This application is a playlist manager and does not host, stream, or distribute any content. Users are responsible for ensuring they have the right to access any content they stream through this application.
