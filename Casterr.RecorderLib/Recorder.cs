﻿using System.Linq;
using System.Threading.Tasks;
using Casterr.RecorderLib.FFmpeg;

namespace Casterr.RecorderLib
{
    public class Recorder
    {
        ProcessManager process = new ProcessManager();

        /// <summary>
        /// Start FFmpeg process and send arguments to it.
        /// </summary>
        /// <param name="args">Arguments to send FFmpeg.</param>
        /// <returns></returns>
        public async Task Start()
        {
            ArgumentBuilder ag = new ArgumentBuilder();

            await process.StartProcess(string.Join(" ", ag.BuildArgs().Select(x => x.Value)));
        }

        /// <summary>
        /// Stop FFmpeg process.
        /// </summary>
        public void Stop()
        {
            process.StopProcess();
        }
    }
}
