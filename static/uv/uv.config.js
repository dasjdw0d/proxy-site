self.__uv$config = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js', // handler
    bundle: '/uv/uv.bundle.js', // bundle
    config: '/uv/uv.config.js', // config
    sw: '/uv/uv.sw.js', // sw
};