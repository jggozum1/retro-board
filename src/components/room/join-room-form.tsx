'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ALIASES = [
  'Captain Backlog', 'Señor Bug', 'The Merge Conflict', 'Deploy Pray',
  'Ctrl+Z Hero', 'NullPointerNinja', 'Git Blame Gary', 'Infinite Looper',
  'Stack Overflow Stan', 'Rubber Duck', 'Scrum Lord', 'Ticket Slayer',
  '404 Brain Not Found', 'It Works On My Machine', 'Caffeine Compiler',
  'Sprint Zombie', 'Jira Warrior', 'Standup Sleeper', 'Refactor Rex',
  'Hotfix Houdini', 'Deadline Dodger', 'PR Approver 9000', 'Spaghetti Coder',
  'The Blocker', 'Bug Whisperer', 'Scope Creep Steve', 'Agile Avenger',
  'Console Log King', 'Todo Tomorrow', 'Div Soup Chef', 'Pixel Pusher',
  'The Uncommitted', 'Force Push Frank', 'Semicolon Sam', 'Tabs Not Spaces',
  'Copy Paste Pete', 'Dependency Dan', 'Localhost Larry', 'Docker Disaster',
  'Kanban Karen', 'Velocity Vampire', 'Burndown Bob', 'Retro Rambo',
  'The Daily Stander', 'Backlog Bandit', 'Epic Fail Earl', 'Story Point Steve',
  'WIP Limit Wanda', 'Pair Program Pat', 'Code Review Carl', 'Linter Larry',
  'Type Error Tim', 'Undefined Ursula', 'Promise Pending Pete', 'Async Await Andy',
  'Callback Hell Hank', 'Middleware Mike', 'Endpoint Eddie', 'Payload Paul',
  'Schema Sheila', 'Migration Marge', 'Rollback Randy', 'Cache Miss Chris',
  'Memory Leak Mel', 'Garbage Collector Gus', 'Thread Pool Theo', 'Race Condition Rick',
  'Deadlock Dave', 'Buffer Overflow Bob', 'Segfault Sally', 'Heap Dump Harry',
  'Stack Trace Stacy', 'Log Level Lucy', 'Debug Mode Doug', 'Breakpoint Betty',
  'Watchpoint Wally', 'Profile Pete', 'Benchmark Ben', 'Latency Lisa',
  'Throughput Tina', 'Uptime Uma', 'Downtime Derek', 'Incident Ian',
  'Postmortem Patty', 'Root Cause Rosa', 'Blame Game Brian', 'Blameless Brad',
  'On Call Oscar', 'Page Duty Pam', 'Alert Fatigue Al', 'False Alarm Fred',
  'Escalation Emily', 'Runbook Roger', 'Playbook Penny', 'Dashboard Dan',
  'Metrics Martha', 'Grafana Greg', 'Kibana Kate', 'Splunk Spencer',
  'Terraform Terry', 'Ansible Annie', 'Kubernetes Kurt', 'Helm Chart Helen',
  'Pod Crasher Pete', 'Node Drainer Nancy', 'Load Balancer Lou', 'Auto Scaler Alex',
  'Serverless Sam', 'Lambda Linda', 'Cold Start Carl', 'Warm Pool Wendy',
  'Edge Function Ed', 'CDN Cathy', 'Cache Buster Chuck', 'Purge Button Pat',
  'SSL Cert Sally', 'DNS Disaster Don', 'CORS Error Carol', 'Proxy Pass Paul',
  'Firewall Frank', 'VPN Victor', 'SSH Tunnel Tony', 'Port Scanner Pete',
  'Ping Timeout Pam', 'Packet Loss Pat', 'Bandwidth Bill', 'Throttle Thelma',
  'Rate Limiter Ray', 'Retry Logic Rita', 'Circuit Breaker CB', 'Fallback Fiona',
  'Feature Flag Phil', 'A/B Test Abby', 'Canary Deploy Cal', 'Blue Green Benny',
  'Shadow Traffic Shawn', 'Chaos Monkey Charlie', 'Gremlin Grace', 'Fault Injector Fay',
  'Load Tester Luke', 'Stress Test Stella', 'Soak Test Sophie', 'Smoke Test Simon',
  'Regression Reggie', 'Flaky Test Flo', 'Test Pyramid Tara', 'Mock Server Moe',
  'Stub Service Stan', 'Fixture Factory Fern', 'Seed Data Sid', 'Migration Mary',
  'Schema Drift Shane', 'Data Janitor Jake', 'ETL Elvis', 'Pipeline Patsy',
  'Cron Job Cody', 'Queue Worker Quinn', 'Dead Letter Dexter', 'Poison Pill Polly',
  'Idempotent Ida', 'Eventual Consistency Eve', 'Strong Consistency Stu', 'CAP Theorem Carl',
  'Partition Tolerance Pat', 'Quorum Quest Quincy', 'Consensus Connie', 'Raft Protocol Ralf',
  'Sharding Sharon', 'Replica Lag Ralph', 'Read Replica Rita', 'Write Ahead Wes',
  'Commit Log Clara', 'Append Only Andy', 'Compaction Cliff', 'Tombstone Tom',
  'TTL Expired Tanya', 'Eviction Policy Eve', 'LRU Cache Larry', 'Bloom Filter Brenda',
  'Hash Ring Harry', 'Consistent Hash Hank', 'Virtual Node Vince', 'Gossip Protocol Gail',
  'Heartbeat Helen', 'Leader Election Lee', 'Split Brain Sam', 'Fencing Token Faye',
  'Lease Holder Lenny', 'Lock Manager Lola', 'Optimistic Lock Otto', 'Pessimistic Pete',
  'MVCC Marvin', 'Snapshot Isolation Sal', 'Serializable Sara', 'Phantom Read Phil',
  'Dirty Read Donna', 'Write Skew Wanda', 'Lost Update Lou', 'Conflict Resolution Cora',
  'Last Write Wins Leo', 'Vector Clock Vic', 'Lamport Timestamp Larry', 'Causal Order Cass',
  'Total Order Tony', 'Broadcast Betty', 'Multicast Mike', 'Unicast Uma',
  'Pub Sub Pablo', 'Fan Out Freddy', 'Fan In Francesca', 'Scatter Gather Scott',
  'Map Reduce Marty', 'Batch Job Barb', 'Micro Batch Mel', 'Stream Processor Stu',
  'Window Function Willa', 'Tumbling Window Tom', 'Sliding Window Sid', 'Session Window Sue',
  'Watermark Wally', 'Late Arrival Larry', 'Out Of Order Omar', 'Exactly Once Ellie',
  'At Least Once Al', 'At Most Once Mo', 'Fire And Forget Fiona', 'Request Reply Rex',
];

function getRandomAlias() {
  return ALIASES[Math.floor(Math.random() * ALIASES.length)];
}

export function JoinRoomForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [useAlias, setUseAlias] = useState(true);

  useEffect(() => {
    setDisplayName(getRandomAlias());
  }, []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase(), displayName }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to join room');
        return;
      }

      const { roomCode } = await res.json();
      router.push(`/room/${roomCode}`);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="room-code"
        label="Room Code"
        placeholder="ABC123"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        required
        maxLength={6}
        className="uppercase tracking-widest text-center text-lg"
      />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="use-alias"
            checked={useAlias}
            onChange={(e) => {
              setUseAlias(e.target.checked);
              if (e.target.checked) setDisplayName(getRandomAlias());
            }}
            className="accent-accent"
          />
          <label htmlFor="use-alias" className="text-sm text-text-secondary">
            Use random alias
          </label>
        </div>
        <Input
          id="display-name"
          label={useAlias ? 'Your Alias' : 'Your Name'}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={useAlias}
          required
          maxLength={50}
        />
        {useAlias && (
          <button
            type="button"
            onClick={() => setDisplayName(getRandomAlias())}
            className="text-xs text-accent hover:text-accent-dim"
          >
            Shuffle alias
          </button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Joining...' : 'Join Room'}
      </Button>
    </form>
  );
}
