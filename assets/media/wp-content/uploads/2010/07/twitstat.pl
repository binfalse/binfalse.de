#!/usr/bin/perl -w
use warnings;
use strict;
use LWP::UserAgent;
use XML::TreeBuilder;
use XML::Entities;
use POSIX;
binmode STDOUT, ":utf8";

my $max = 10;
$max = $ARGV[0] if ($ARGV[0] && isdigit ($ARGV[0]));

my $browser = LWP::UserAgent->new;
$browser->credentials('twitter.com:443', 'Twitter API', 'USER' => 'PASSWORD' );
my $response = $browser->get('https://twitter.com/statuses/friends_timeline.xml');
die "failed...\n" . $response->status_line if (!$response->is_success);
my $tree = XML::TreeBuilder->new();
$tree->parse($response->decoded_content);

my $anz = 1;
foreach my $status ($tree->find_by_tag_name ('status'))
{
	my $time = XML::Entities::decode ('all', $status->find_by_tag_name ('created_at')->as_text);
	my $text = XML::Entities::decode ('all', $status->find_by_tag_name ('text')->as_text);
	my $user = XML::Entities::decode ('all', $status->find_by_tag_name ('user')->find_by_tag_name ('screen_name')->as_text);
	print "$text\n\tby $user at $time\n\n";
	last if (++$anz > $max);
}