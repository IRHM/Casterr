﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Casterr.HelpersLib;
using Casterr.RecorderLib.FFmpeg;

namespace Casterr.RecorderLib
{
  public class Recorder
  {
    ProcessManager process = new ProcessManager();
    ArgumentBuilder ab = new ArgumentBuilder();
    Dictionary<string, string> args;

    /// <summary>
    /// Start FFmpeg process and send arguments to it.
    /// </summary>
    /// <param name="args">Arguments to send FFmpeg.</param>
    /// <returns></returns>
    public async Task Start()
    {
      StatusService.ChangeStatus(1);
      // args = ab.BuildArgs();
      // await process.StartProcess(string.Join(" ", args.Select(x => x.Value)));
    }

    /// <summary>
    /// Stop FFmpeg process.
    /// </summary>
    public async Task Stop()
    {
      // Stop recording process
      process.StopProcess();

      // Add video to PastRecordings
      await Recordings.Add(args["videoOutput"].Replace("\"", ""));
    }
  }
}
