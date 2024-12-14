const os = require('os');

function getServerInfo() {
    return {
        platform: os.platform(),
        arch: os.arch(),
        uptime: os.uptime(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpus: os.cpus().map(cpu => cpu.model),
    };
}

module.exports = getServerInfo;
