const process = require('process');
const core = require('@actions/core');
const exec = require('@actions/exec');

async function run_linux() {
    try {
        const requestedVersion = core.getInput('opencv-version') || '4.0.0';
        const useMasterBranch = requestedVersion == 'master' ||
                                requestedVersion == 'dev'    ||
                                requestedVersion == 'latest' ||
                                requestedVersion == 'last';

        const version = useMasterBranch ? 'master' : requestedVersion;
        const extraModules = core.getInput('opencv-extra-modules') == 'true';
        const installDeps = core.getInput('install-deps') == undefined || core.getInput('install-deps') == 'true';

        const CMAKE_CXX_COMPILER         = core.getInput('CMAKE_CXX_COMPILER');
        const CMAKE_CXX_STANDARD         = core.getInput('CMAKE_CXX_STANDARD');
        const CMAKE_INSTALL_PREFIX       = core.getInput('CMAKE_INSTALL_PREFIX');
        const WITH_TBB                   = core.getInput('WITH_TBB');
        const WITH_IPP                   = core.getInput('WITH_IPP');
        const BUILD_NEW_PYTHON_SUPPORT   = core.getInput('BUILD_NEW_PYTHON_SUPPORT');
        const WITH_V4L                   = core.getInput('WITH_V4L');
        const ENABLE_PRECOMPILED_HEADERS = core.getInput('ENABLE_PRECOMPILED_HEADERS');
        const INSTALL_C_EXAMPLES         = core.getInput('INSTALL_C_EXAMPLES');
        const INSTALL_PYTHON_EXAMPLES    = core.getInput('INSTALL_PYTHON_EXAMPLES');
        const BUILD_EXAMPLES             = core.getInput('BUILD_EXAMPLES');
        const WITH_QT                    = core.getInput('WITH_QT');
        const WITH_OPENGL                = core.getInput('WITH_OPENGL');
        const GENERATE_PKGCONFIG         = core.getInput('GENERATE_PKGCONFIG');

        if (installDeps) {
            core.startGroup('Install dependencies');
            await exec.exec('sudo add-apt-repository "deb http://security.ubuntu.com/ubuntu xenial-security main"');
            await exec.exec('sudo apt-get update');
            await exec.exec('sudo apt-get remove x264 libx264-dev -y');
            await exec.exec('sudo apt-get install -y ' +
                'build-essential checkinstall git cmake pkg-config yasm ' +
                'git gfortran libjpeg8-dev libjasper1 libjasper-dev libpng-dev ' +
                'libavcodec-dev libavformat-dev libswscale-dev libdc1394-22-dev ' +
                'libxine2-dev libv4l-dev ' +
                'libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev ' +
                'qt5-default libgtk2.0-dev libtbb-dev ' +
                'libatlas-base-dev ' +
                'libfaac-dev libmp3lame-dev libtheora-dev ' +
                'libvorbis-dev libxvidcore-dev ' +
                'libopencore-amrnb-dev libopencore-amrwb-dev ' +
                'libtbb2 libtiff-dev ' +
                'python-dev python-numpy ' +
                'x264 v4l-utils '
            );
            core.endGroup();
        }

        core.startGroup('Download source code');
        await exec.exec(`git clone https://github.com/opencv/opencv.git`);
        await exec.exec(`git -C opencv checkout ${version}`);

        if(extraModules) {
            await exec.exec(`git clone https://github.com/opencv/opencv_contrib.git`);
            await exec.exec(`git -C opencv_contrib checkout ${version}`);
        }
        core.endGroup();
      
        const cmakeCmd = 'cmake -S opencv -B opencv/build ' +
            ' -D CMAKE_CXX_COMPILER=' + CMAKE_CXX_COMPILER + 
            ' -D CMAKE_CXX_STANDARD=' + CMAKE_CXX_STANDARD + 
            ' -D CMAKE_INSTALL_PREFIX=' + CMAKE_INSTALL_PREFIX +
            ' -D WITH_TBB=' + WITH_TBB + 
            ' -D WITH_IPP=' + WITH_IPP + 
            ' -D BUILD_NEW_PYTHON_SUPPORT=' + BUILD_NEW_PYTHON_SUPPORT +
            ' -D WITH_V4L=' + WITH_V4L +
            ' -D ENABLE_PRECOMPILED_HEADERS=' + ENABLE_PRECOMPILED_HEADERS +
            ' -D INSTALL_C_EXAMPLES=' + INSTALL_C_EXAMPLES +
            ' -D INSTALL_PYTHON_EXAMPLES=' + INSTALL_PYTHON_EXAMPLES +
            ' -D BUILD_EXAMPLES=' + BUILD_EXAMPLES +
            ' -D WITH_QT=' + WITH_QT +
            ' -D WITH_OPENGL=' + WITH_OPENGL +
            ' -D OPENCV_GENERATE_PKGCONFIG=' + GENERATE_PKGCONFIG +
            (extraModules ? ' -D OPENCV_EXTRA_MODULES_PATH=./opencv_contrib/modules ' : '');

        console.log(`Compile cmd: ${cmakeCmd}`);

        core.startGroup('Compile and install');
        await exec.exec(cmakeCmd);
        await exec.exec('make -j10 -C opencv/build');
        await exec.exec('sudo make -C opencv/build install');
        await exec.exec('sudo ldconfig');
        core.endGroup();
        
        // Clean up?
        core.startGroup('Cleanup');
        await exec.exec('rm -rf opencv');
        await exec.exec('rm -rf opencv_contrib');
        core.endGroup();

    } catch (error) {
        core.setFailed(error.message);
    }
}

async function run_macos() {
    try {
        const requestedVersion = core.getInput('opencv-version') || '4.0.0';
        const useMasterBranch = requestedVersion == 'master' ||
                                requestedVersion == 'dev'    ||
                                requestedVersion == 'latest' ||
                                requestedVersion == 'last';

        const version = useMasterBranch ? 'master' : requestedVersion;
        const extraModules = core.getInput('opencv-extra-modules') == 'true';
        const installDeps = core.getInput('install-deps') == undefined || core.getInput('install-deps') == 'true';

        const CMAKE_CXX_COMPILER         = core.getInput('CMAKE_CXX_COMPILER');
        const CMAKE_CXX_STANDARD         = core.getInput('CMAKE_CXX_STANDARD');
        const CMAKE_INSTALL_PREFIX       = core.getInput('CMAKE_INSTALL_PREFIX');
        const WITH_TBB                   = core.getInput('WITH_TBB');
        const WITH_IPP                   = core.getInput('WITH_IPP');
        const BUILD_NEW_PYTHON_SUPPORT   = core.getInput('BUILD_NEW_PYTHON_SUPPORT');
        const WITH_V4L                   = core.getInput('WITH_V4L');
        const ENABLE_PRECOMPILED_HEADERS = core.getInput('ENABLE_PRECOMPILED_HEADERS');
        const INSTALL_C_EXAMPLES         = core.getInput('INSTALL_C_EXAMPLES');
        const INSTALL_PYTHON_EXAMPLES    = core.getInput('INSTALL_PYTHON_EXAMPLES');
        const BUILD_EXAMPLES             = core.getInput('BUILD_EXAMPLES');
        const WITH_QT                    = core.getInput('WITH_QT');
        const WITH_OPENGL                = core.getInput('WITH_OPENGL');
        const GENERATE_PKGCONFIG         = core.getInput('GENERATE_PKGCONFIG');

        if (installDeps) {
            core.startGroup('Install dependencies');
            await exec.exec('brew install --build-from-source cmake');
            await exec.exec('brew install git pkg-config autoconf automake pixman dylibbundler');
            core.endGroup();          
        }

        core.startGroup('Download source code');
        await exec.exec(`git clone https://github.com/opencv/opencv.git`);
        await exec.exec(`git -C opencv checkout ${version}`);

        if(extraModules) {
            await exec.exec(`git clone https://github.com/opencv/opencv_contrib.git`);
            await exec.exec(`git -C opencv_contrib checkout ${version}`);
        }
        core.endGroup();
      
        const cmakeCmd = 'cmake -S opencv -B opencv/build ' +
            ' -D CMAKE_CXX_COMPILER=' + CMAKE_CXX_COMPILER + 
            ' -D CMAKE_CXX_STANDARD=' + CMAKE_CXX_STANDARD + 
            ' -D CMAKE_INSTALL_PREFIX=' + CMAKE_INSTALL_PREFIX +
            ' -D WITH_TBB=' + WITH_TBB + 
            ' -D WITH_IPP=' + WITH_IPP + 
            ' -D BUILD_NEW_PYTHON_SUPPORT=' + BUILD_NEW_PYTHON_SUPPORT +
            ' -D WITH_V4L=' + WITH_V4L +
            ' -D ENABLE_PRECOMPILED_HEADERS=' + ENABLE_PRECOMPILED_HEADERS +
            ' -D INSTALL_C_EXAMPLES=' + INSTALL_C_EXAMPLES +
            ' -D INSTALL_PYTHON_EXAMPLES=' + INSTALL_PYTHON_EXAMPLES +
            ' -D BUILD_EXAMPLES=' + BUILD_EXAMPLES +
            ' -D WITH_QT=' + WITH_QT +
            ' -D WITH_OPENGL=' + WITH_OPENGL +
            ' -D OPENCV_GENERATE_PKGCONFIG=' + GENERATE_PKGCONFIG +
            (extraModules ? ' -D OPENCV_EXTRA_MODULES_PATH=./opencv_contrib/modules ' : '');

        console.log(`Compile cmd: ${cmakeCmd}`);

        core.startGroup('Compile and install');
        await exec.exec(cmakeCmd);
        await exec.exec('make -j10 -C opencv/build');
        await exec.exec('sudo make -C opencv/build install');
        core.endGroup();
        
        // Clean up?
        core.startGroup('Cleanup');
        await exec.exec('rm -rf opencv');
        await exec.exec('rm -rf opencv_contrib');
        core.endGroup();

    } catch (error) {
        core.setFailed(error.message);
    }
}

async function run_windows() {
    try {
        const requestedVersion = core.getInput('opencv-version') || '4.0.0';
        const useMasterBranch = requestedVersion == 'master' ||
                                requestedVersion == 'dev'    ||
                                requestedVersion == 'latest' ||
                                requestedVersion == 'last';

        const version = useMasterBranch ? 'master' : requestedVersion;
        const extraModules = core.getInput('opencv-extra-modules') == 'true';
        const installDeps = core.getInput('install-deps') == undefined || core.getInput('install-deps') == 'true';

        const CMAKE_CXX_COMPILER         = core.getInput('CMAKE_CXX_COMPILER');
        const CMAKE_CXX_STANDARD         = core.getInput('CMAKE_CXX_STANDARD');
        let CMAKE_INSTALL_PREFIX       = core.getInput('CMAKE_INSTALL_PREFIX');
        if(CMAKE_INSTALL_PREFIX == '/usr/local') {
            CMAKE_INSTALL_PREFIX = 'C:/opencv';
        }
        const WITH_TBB                   = core.getInput('WITH_TBB');
        if(WITH_TBB == 'ON') {
            core.setFailed("WITH_TBB is not supported on Windows.");
            return;
        }
        const WITH_IPP                   = core.getInput('WITH_IPP');
        if(WITH_IPP == 'ON') {
            core.setFailed("WITH_IPP is not supported on Windows.");
            return;
        }
        const BUILD_NEW_PYTHON_SUPPORT   = core.getInput('BUILD_NEW_PYTHON_SUPPORT');
        const WITH_V4L                   = core.getInput('WITH_V4L');
        const ENABLE_PRECOMPILED_HEADERS = core.getInput('ENABLE_PRECOMPILED_HEADERS');
        if(ENABLE_PRECOMPILED_HEADERS == 'ON') {
            core.setFailed("ENABLE_PRECOMPILED_HEADERS is not supported on Windows.");
            return;
        }
        const INSTALL_C_EXAMPLES         = core.getInput('INSTALL_C_EXAMPLES');
        const INSTALL_PYTHON_EXAMPLES    = core.getInput('INSTALL_PYTHON_EXAMPLES');
        const BUILD_EXAMPLES             = core.getInput('BUILD_EXAMPLES');
        const WITH_QT                    = core.getInput('WITH_QT');
        const WITH_OPENGL                = core.getInput('WITH_OPENGL');
        const GENERATE_PKGCONFIG         = core.getInput('GENERATE_PKGCONFIG');
        const options = {};
        options.shell = 'powershell';

        if (installDeps) {
            core.startGroup('Install dependencies');
            await exec.exec('choco.exe install -PackageName mingw --force' , [], options);
            await exec.exec('choco.exe install -PackageName cmake --force' , [], options);
            core.endGroup();
        }

        core.startGroup('Download source code');
        await exec.exec(`git clone https://github.com/opencv/opencv.git`);
        await exec.exec(`git -C opencv checkout ${version}`);

        if(extraModules) {
            await exec.exec(`git clone https://github.com/opencv/opencv_contrib.git`);
            await exec.exec(`git -C opencv_contrib checkout ${version}`);
        }
        core.endGroup();
      
        const cmakeCmd = 'cmake -G "MinGW Makefiles" -S opencv -B opencv/build ' +
            ' -D CMAKE_CXX_COMPILER=' + CMAKE_CXX_COMPILER + 
            ' -D CMAKE_INSTALL_PREFIX=' + CMAKE_INSTALL_PREFIX +
            ' -D WITH_TBB=' + "OFF" + 
            ' -D WITH_IPP=' + "OFF" + 
            ' -D BUILD_NEW_PYTHON_SUPPORT=' + BUILD_NEW_PYTHON_SUPPORT +
            ' -D WITH_V4L=' + WITH_V4L +
            ' -D CMAKE_CXX_STANDARD=' + CMAKE_CXX_STANDARD + 
            ' -D ENABLE_PRECOMPILED_HEADERS=' + "OFF" +
            ' -D INSTALL_C_EXAMPLES=' + INSTALL_C_EXAMPLES +
            ' -D INSTALL_PYTHON_EXAMPLES=' + INSTALL_PYTHON_EXAMPLES +
            ' -D BUILD_EXAMPLES=' + BUILD_EXAMPLES +
            ' -D WITH_QT=' + WITH_QT +
            ' -D WITH_OPENGL=' + WITH_OPENGL +
            ' -D WITH_MSMF=OFF' +
            ' -D OPENCV_ENABLE_ALLOCATOR_STATS=OFF' +
            ' -D OPENCV_GENERATE_PKGCONFIG=' + GENERATE_PKGCONFIG +
            (extraModules ? ' -D OPENCV_EXTRA_MODULES_PATH=./opencv_contrib/modules ' : '');

        console.log(`Compile cmd: ${cmakeCmd}`);

        core.startGroup('Compile and install');
        await exec.exec(cmakeCmd, [], options);
        await exec.exec('mingw32-make -j10 -C opencv/build', [], options);
        await exec.exec('mingw32-make -C opencv/build install', [], options);
        core.endGroup();
        
        // Clean up?
        core.startGroup('Cleanup');
        await exec.exec('rm -rf opencv', [], options);
        await exec.exec('rm -rf opencv_contrib', [], options);
        core.endGroup();

    } catch (error) {
        core.setFailed(error.message);
    }
}

async function run() {
    switch (process.platform) {
        case 'win32':
            run_windows();
            break;
        case 'darwin':
            run_macos();
            break;
        case 'linux':
            run_linux();
            break;
        default:
            core.setFailed(`Unsupported OS '${process.platform}'`);
            break;
    }
}

run();
