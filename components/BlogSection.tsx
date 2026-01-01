
import React from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '../types';
import { ArrowUpRight, Clock, User, Tag } from 'lucide-react';

interface BlogSectionProps {
    posts: BlogPost[];
    onReadMore: (post: BlogPost) => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts, onReadMore }) => {
    return (
        <section className="py-24 bg-white dark:bg-[#050505] overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="w-12 h-px bg-primary-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-600 italic">
                                Crecimiento Estratégico
                            </span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-[0.9]"
                        >
                            Blog de <span className="text-primary-600">Rentabilidad</span> Fitness
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-sm font-bold text-neutral-500 dark:text-neutral-400 max-w-sm uppercase tracking-wider leading-relaxed"
                    >
                        Aprende a transformar tu inversión en un negocio de alto rendimiento con nuestra guía experta.
                    </motion.p>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onReadMore(post)}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 shadow-2xl">
                                {/* Image with Grain/Overlay */}
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                {/* Floating Meta */}
                                <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                                    <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
                                        <Tag size={12} className="text-primary-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white">{post.category}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                        <ArrowUpRight size={20} />
                                    </div>
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-primary-400 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            <span>{post.readTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={12} />
                                            <span>{post.author}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-primary-500 transition-colors">
                                        {post.title}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 line-clamp-2 uppercase tracking-wide leading-relaxed opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                {post.excerpt}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
