#!/usr/bin/env python3
"""
Mizo Green IPTV Player
A simple IPTV player that supports M3U playlists
"""

import os
import sys
import argparse
import configparser
from typing import List, Dict, Optional
import requests


class M3UParser:
    """Parser for M3U playlist files"""
    
    def __init__(self):
        self.channels: List[Dict[str, str]] = []
    
    def parse_file(self, filepath: str) -> List[Dict[str, str]]:
        """Parse M3U file and return list of channels"""
        self.channels = []
        
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Playlist file not found: {filepath}")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        return self._parse_lines(lines)
    
    def parse_url(self, url: str) -> List[Dict[str, str]]:
        """Parse M3U from URL and return list of channels"""
        self.channels = []
        
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            lines = response.text.split('\n')
            return self._parse_lines(lines)
        except requests.RequestException as e:
            raise Exception(f"Failed to fetch playlist from URL: {e}")
    
    def _parse_lines(self, lines: List[str]) -> List[Dict[str, str]]:
        """Parse M3U lines"""
        current_channel = {}
        
        for line in lines:
            line = line.strip()
            
            if not line or line.startswith('#EXTM3U'):
                continue
            
            if line.startswith('#EXTINF:'):
                # Extract channel info
                parts = line.split(',', 1)
                if len(parts) == 2:
                    current_channel['name'] = parts[1].strip()
                    
                    # Extract additional info from EXTINF line
                    info_part = parts[0]
                    if 'tvg-logo=' in info_part:
                        logo_start = info_part.find('tvg-logo="') + 10
                        logo_end = info_part.find('"', logo_start)
                        if logo_end > logo_start:
                            current_channel['logo'] = info_part[logo_start:logo_end]
                    
                    if 'tvg-id=' in info_part:
                        id_start = info_part.find('tvg-id="') + 8
                        id_end = info_part.find('"', id_start)
                        if id_end > id_start:
                            current_channel['id'] = info_part[id_start:id_end]
                    
                    if 'group-title=' in info_part:
                        group_start = info_part.find('group-title="') + 13
                        group_end = info_part.find('"', group_start)
                        if group_end > group_start:
                            current_channel['group'] = info_part[group_start:group_end]
            
            elif line.startswith('http://') or line.startswith('https://'):
                # This is a stream URL
                if current_channel:
                    current_channel['url'] = line
                    self.channels.append(current_channel.copy())
                    current_channel = {}
        
        return self.channels


class IPTVPlayer:
    """Simple IPTV Player"""
    
    def __init__(self, config_file: Optional[str] = None):
        self.config = self._load_config(config_file)
        self.parser = M3UParser()
        self.channels: List[Dict[str, str]] = []
    
    def _load_config(self, config_file: Optional[str]) -> configparser.ConfigParser:
        """Load configuration from file"""
        config = configparser.ConfigParser()
        
        if config_file and os.path.exists(config_file):
            config.read(config_file)
        else:
            # Default configuration
            config['DEFAULT'] = {
                'playlist': 'playlist.m3u',
                'user_agent': 'Mizo Green IPTV Player/1.0'
            }
        
        return config
    
    def load_playlist(self, source: str) -> None:
        """Load playlist from file or URL"""
        print(f"Loading playlist from: {source}")
        
        if source.startswith('http://') or source.startswith('https://'):
            self.channels = self.parser.parse_url(source)
        else:
            self.channels = self.parser.parse_file(source)
        
        print(f"Loaded {len(self.channels)} channels")
    
    def list_channels(self, group: Optional[str] = None) -> None:
        """List all channels or channels from a specific group"""
        if not self.channels:
            print("No channels loaded. Please load a playlist first.")
            return
        
        channels_to_show = self.channels
        
        if group:
            channels_to_show = [ch for ch in self.channels if ch.get('group') == group]
        
        print(f"\nAvailable channels ({len(channels_to_show)}):")
        print("-" * 60)
        
        for idx, channel in enumerate(channels_to_show, 1):
            name = channel.get('name', 'Unknown')
            group_name = channel.get('group', 'N/A')
            print(f"{idx}. {name} (Group: {group_name})")
    
    def list_groups(self) -> None:
        """List all available channel groups"""
        if not self.channels:
            print("No channels loaded. Please load a playlist first.")
            return
        
        groups = set()
        for channel in self.channels:
            if 'group' in channel:
                groups.add(channel['group'])
        
        print(f"\nAvailable groups ({len(groups)}):")
        print("-" * 60)
        for group in sorted(groups):
            count = len([ch for ch in self.channels if ch.get('group') == group])
            print(f"- {group} ({count} channels)")
    
    def get_channel_info(self, channel_name: str) -> Optional[Dict[str, str]]:
        """Get information about a specific channel"""
        for channel in self.channels:
            if channel.get('name', '').lower() == channel_name.lower():
                return channel
        return None
    
    def play_channel(self, channel_name: str) -> None:
        """Play a specific channel"""
        channel = self.get_channel_info(channel_name)
        
        if not channel:
            print(f"Channel '{channel_name}' not found")
            return
        
        print(f"\nChannel: {channel.get('name')}")
        print(f"Group: {channel.get('group', 'N/A')}")
        print(f"Stream URL: {channel.get('url')}")
        print("\nNote: Video playback requires VLC or a compatible media player.")
        print("You can copy the stream URL above and play it in your media player.")


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Mizo Green IPTV Player - A simple IPTV playlist manager',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --playlist playlist.m3u --list
  %(prog)s --playlist https://example.com/playlist.m3u --groups
  %(prog)s --playlist playlist.m3u --play "Channel Name"
        """
    )
    
    parser.add_argument(
        '--config', '-c',
        help='Configuration file path',
        default='config.ini'
    )
    
    parser.add_argument(
        '--playlist', '-p',
        help='Path or URL to M3U playlist file',
        required=True
    )
    
    parser.add_argument(
        '--list', '-l',
        action='store_true',
        help='List all channels'
    )
    
    parser.add_argument(
        '--groups', '-g',
        action='store_true',
        help='List all channel groups'
    )
    
    parser.add_argument(
        '--group',
        help='Filter channels by group'
    )
    
    parser.add_argument(
        '--play',
        help='Play a specific channel by name'
    )
    
    parser.add_argument(
        '--info',
        help='Show information about a specific channel'
    )
    
    args = parser.parse_args()
    
    try:
        player = IPTVPlayer(args.config if os.path.exists(args.config) else None)
        player.load_playlist(args.playlist)
        
        if args.groups:
            player.list_groups()
        elif args.list or args.group:
            player.list_channels(args.group)
        elif args.play:
            player.play_channel(args.play)
        elif args.info:
            channel = player.get_channel_info(args.info)
            if channel:
                print("\nChannel Information:")
                print("-" * 60)
                for key, value in channel.items():
                    print(f"{key.capitalize()}: {value}")
            else:
                print(f"Channel '{args.info}' not found")
        else:
            parser.print_help()
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
