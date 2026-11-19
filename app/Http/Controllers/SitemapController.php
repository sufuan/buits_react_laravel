<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TicketingEvent;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Dynamic XML sitemap: static public pages plus every event and
     * ticketing event, so new events appear automatically.
     */
    public function index(): Response
    {
        $urls = collect([
            ['loc' => url('/'), 'priority' => '1.0'],
            ['loc' => url('/about'), 'priority' => '0.8'],
            ['loc' => url('/events'), 'priority' => '0.8'],
            ['loc' => url('/programs'), 'priority' => '0.7'],
            ['loc' => url('/committees'), 'priority' => '0.7'],
            ['loc' => url('/previous-committee'), 'priority' => '0.6'],
            ['loc' => url('/museum'), 'priority' => '0.6'],
            ['loc' => url('/find-member'), 'priority' => '0.5'],
            ['loc' => url('/register'), 'priority' => '0.6'],
            ['loc' => url('/login'), 'priority' => '0.4'],
        ]);

        foreach (TicketingEvent::query()->orderByDesc('updated_at')->get(['slug', 'updated_at']) as $event) {
            $urls->push([
                'loc' => url('/t/' . $event->slug),
                'lastmod' => optional($event->updated_at)->toDateString(),
                'priority' => '0.8',
            ]);
        }

        foreach (Event::query()->orderByDesc('updated_at')->get(['id', 'updated_at']) as $event) {
            $urls->push([
                'loc' => url('/events/' . $event->id),
                'lastmod' => optional($event->updated_at)->toDateString(),
                'priority' => '0.7',
            ]);
        }

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
