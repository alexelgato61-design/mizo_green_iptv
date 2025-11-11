#!/usr/bin/env python3
"""
Simple tests for the M3U parser
"""

import os
import sys
from mizo_green_iptv import M3UParser


def test_m3u_parser():
    """Test M3U parser with example playlist"""
    parser = M3UParser()
    
    # Create a test playlist
    test_content = """#EXTM3U
#EXTINF:-1 tvg-id="test1" tvg-logo="http://example.com/logo1.png" group-title="Test",Test Channel 1
http://example.com/stream1.m3u8
#EXTINF:-1 tvg-id="test2" tvg-logo="http://example.com/logo2.png" group-title="Test",Test Channel 2
http://example.com/stream2.m3u8
"""
    
    # Write test file
    test_file = '/tmp/test_playlist.m3u'
    with open(test_file, 'w') as f:
        f.write(test_content)
    
    # Parse the file
    try:
        channels = parser.parse_file(test_file)
        
        # Verify results
        assert len(channels) == 2, f"Expected 2 channels, got {len(channels)}"
        
        # Check first channel
        assert channels[0]['name'] == 'Test Channel 1', "Channel 1 name mismatch"
        assert channels[0]['id'] == 'test1', "Channel 1 id mismatch"
        assert channels[0]['group'] == 'Test', "Channel 1 group mismatch"
        assert channels[0]['url'] == 'http://example.com/stream1.m3u8', "Channel 1 URL mismatch"
        
        # Check second channel
        assert channels[1]['name'] == 'Test Channel 2', "Channel 2 name mismatch"
        assert channels[1]['id'] == 'test2', "Channel 2 id mismatch"
        
        print("✅ All tests passed!")
        return True
        
    except AssertionError as e:
        print(f"❌ Test failed: {e}")
        return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    finally:
        # Clean up
        if os.path.exists(test_file):
            os.remove(test_file)


if __name__ == '__main__':
    success = test_m3u_parser()
    sys.exit(0 if success else 1)
